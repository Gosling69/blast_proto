import { BoardModel } from '../board/models/BoardModel'
import { BoardView } from '../board/views/BoardView'
import { GravityController } from '../board/controllers/GravityController'
import { MatchController } from '../board/controllers/MatchController'
import { SpawnController } from '../board/controllers/SpawnController'
import { UIController } from '../ui/controllers/UIController'
import { BoosterController } from '../gameplay/controllers/BoosterController'

import { RulesController } from '../gameplay/controllers/RulesController'
import { ScoreController } from '../gameplay/controllers/ScoreController'
import { SpecialTileController } from '../gameplay/controllers/SpecialTilesController'
import Board from '../board/components/Board'
import UIRoot from '../ui/components/UIRoot'
import { TDifficulty, TRoundConfig } from '../shared/shared.types'
import { BASE_DIFFICULTIES, DEFAULT_CONFIG } from '../shared/shared.constants'
import { createDestroyContext, inputStateToSelectedBooster } from './core.utils'
import {
  TDestroyAction,
  TGameStatus,
  TInputAction,
  TInputState,
  TSwapAction,
  TTurnResolution,
} from '../gameplay/gameplay.types'
import { THudViewModel } from '../ui/ui.types'
import { InputController } from '../gameplay/controllers/InputController'
import { GameModel } from '../gameplay/models/GameModel'
import { TTileData, TileType } from '../board/board.types'

export type TTurnState = `idle` | `processing` | `finished`
export class GameController {
  private boardModel!: BoardModel<TTileData>
  private gameModel!: GameModel
  private config: TRoundConfig = DEFAULT_CONFIG

  private readonly boardView: BoardView

  private readonly gravityController: GravityController = new GravityController()
  private readonly inputController: InputController = new InputController()
  private readonly matchController: MatchController = new MatchController()
  private readonly spawnController: SpawnController = new SpawnController()
  private readonly rulesController: RulesController = new RulesController()
  private readonly scoreController: ScoreController = new ScoreController()
  private readonly boosterController: BoosterController = new BoosterController()
  private readonly specialTileController: SpecialTileController = new SpecialTileController()
  private readonly uiController: UIController
  private turnState: TTurnState = `idle`

  constructor(
    private readonly boardFrame: Board,
    private readonly uiRootFrame: UIRoot,
  ) {
    this.boardView = new BoardView(this.boardFrame)
    this.boardView.onTileClick = this.handleTileClick.bind(this)
    this.uiController = new UIController(this.uiRootFrame)
    this.uiController.onBombButtonClick = () => this.handleBombButtonClick()
    this.uiController.onSwapButtonClick = () => this.handleTeleportButtonClick()
    this.uiController.setLevelSelectOnClickHandler(this.onDifficultySelected.bind(this))
    this.uiController.disableGameUI()
    ;(window as any)[`shuffle`] = async () => {
      if (!this.gameModel?.boardShufflesLeft) {
        console.error(`No shuffles, even for degub :c`)
        return
      }
      await this.shuffleBoard()
      this.gameModel.spendBoardShuffle()
    }
  }
  async initializeGame() {
    return this.uiController.playLevelSelectPanelSpawnAnimation()
  }

  private async initializeRound() {
    this.boardModel = new BoardModel<TTileData>(this.config.boardWidth, this.config.boardHeight)

    this.gameModel = new GameModel(this.config)
    await this.boardView.playSpawnAnimation()
    await this.uiController.playRoundUISpawnAnimation()

    this.boardView.reset({
      width: this.boardModel.widthTiles,
      height: this.boardModel.heightTiles,
    })
    this.spawnController.createInitialCells(
      this.boardModel,
      this.gameModel.difficultySettings,
      this.gameModel.initialConnectedGroupsRatio,
    )
    await this.boardView.renderByRows(this.boardModel)
    this.turnState = `idle`
    this.uiController.enableGameUI()
    this.uiController.render(this.createHudViewModel())
  }
  async disposeRound() {
    await this.uiController.playRoundUIDespawnAnimation()
    await this.boardView.clear()
  }

  private async onAfterDestroy() {
    const moves = this.gravityController.applyGravity(this.boardModel)

    this.spawnController.createAdditionalRegularCells(this.boardModel, this.gameModel.difficultySettings)

    const gravityPromise = this.boardView.animateGravity(moves)
    const spawnPromise = this.boardView.renderByRows(this.boardModel)
    await Promise.all([gravityPromise, spawnPromise])
    return Promise.resolve()
  }
  private async onTurnFinished(): Promise<void> {
    const resolution = this.getTurnResolution()
    switch (resolution) {
      case 'needShuffle':
        await this.shuffleBoard()
        this.gameModel.spendBoardShuffle()
        this.turnState = 'idle'
        return

      case 'win':
      case 'lose':
        await this.onRoundFinished(resolution)
        return

      case 'playing':
        this.turnState = 'idle'
        return
    }
  }
  private getTurnResolution(): TTurnResolution {
    const hasAvailableMoves = this.matchController.hasAvailableMoves(
      this.boardModel,
      this.gameModel.minGroupSizeForTurn,
    )
    return this.rulesController.getTurnResolution({
      score: this.gameModel.score,
      targetScore: this.gameModel.targetScore,
      turnsLeft: this.gameModel.numTurnsLeft,
      hasAvailableMoves,
      hasBoosters: this.gameModel.hasBoosters,
      shufflesLeft: this.gameModel.boardShufflesLeft,
    })
  }
  private async onRoundFinished(status: TGameStatus): Promise<void> {
    this.uiController.disableGameUI()
    this.gameModel.setStatus(status)
    this.turnState = `finished`
    this.uiController.render(this.createHudViewModel())
    await this.uiController.showGameResult(status)
    return this.restart()
  }
  private async onDifficultySelected(difficulty: TDifficulty) {
    const config = {
      ...BASE_DIFFICULTIES[difficulty],
      groupSizeSettings: {
        ...BASE_DIFFICULTIES[difficulty].groupSizeSettings,
      },
    }
    this.config = config
    await this.uiController.playLevelSelectPanelDeSpawnAnimation()
    return this.initializeRound()
  }
  private async restart(): Promise<void> {
    await this.disposeRound()
    await this.initializeGame()
  }
  private canHandleInput(tile: TTileData): boolean {
    const currentTile = this.boardModel.get(tile.x, tile.y)

    return this.gameModel.status === 'playing' && currentTile?.id === tile.id && this.turnState === `idle`
  }
  private handleBombButtonClick() {
    if (this.turnState !== 'idle') return

    const previousState = this.inputController.getState()

    if (previousState.type === 'bomb') {
      this.inputController.setDefault()
    } else if (this.gameModel.numBombBoosters > 0) {
      this.inputController.enableBomb()
    }

    this.syncInputView(previousState, this.inputController.getState())
  }
  private handleTeleportButtonClick() {
    if (this.turnState !== 'idle') return

    const previousState = this.inputController.getState()

    if (previousState.type === 'swap') {
      this.inputController.setDefault()
    } else if (this.gameModel.numTeleportBoosters > 0) {
      this.inputController.enableSwap()
    }

    this.syncInputView(previousState, this.inputController.getState())
  }

  private async handleTileClick(tile: TTileData): Promise<void> {
    if (!this.canHandleInput(tile)) return

    const previousState = this.inputController.getState()

    const action = this.inputController.resolveTileClick(tile)

    const currentState = this.inputController.getState()

    this.syncInputView(previousState, currentState)

    switch (action.type) {
      case 'swapSelectFirst':
        return this.selectSwapTile(action.tile)

      case 'swapDeselectFirst':
        return this.deSelectSwapTile(action.tile)

      case 'swapApply':
        return this.executeSwapAction(action)
      case 'defaultTileClick':
      case 'bombTileClick':
        return this.executeDestroyAction(action)
    }
  }
  private selectSwapTile(tile: TTileData) {
    this.boardView.setTileSelected(tile, true)
  }
  private deSelectSwapTile(tile: TTileData) {
    this.boardView.setTileSelected(tile, false)
  }
  private async executeSwapAction(action: TSwapAction): Promise<void> {
    if (!this.rulesController.canSwap(this.gameModel)) {
      this.inputController.setDefault()
      this.uiController.setSelectedBooster(null)
      return
    }

    const { firstTile, secondTile } = action
    this.turnState = 'processing'

    this.boardView.setTileSelected(firstTile, false)

    this.boosterController.swapTiles(this.boardModel, firstTile, secondTile)

    this.gameModel.spendSwapBooster()

    await this.boardView.animateSwap(firstTile, secondTile)

    this.uiController.render(this.createHudViewModel())

    return this.onTurnFinished()
  }
  private async executeDestroyAction(action: TDestroyAction) {
    this.turnState = `processing`
    const { tile } = action
    const targets = this.gatherDestroyTargets(tile, action)
    await this.applyDestroyAction(tile, targets, action)
    return this.onTurnFinished()
  }
  private async applyDestroyAction(clickedTile: TTileData, targets: TTileData[], action: TInputAction) {
    const context = createDestroyContext(action, clickedTile, targets)
    if (!this.rulesController.canDestroy(context, this.gameModel.minGroupSizeForTurn)) {
      this.boardView.shakeTile(clickedTile)
      return
    }
    this.spendResourcesForAction(action)
    const shouldSpawnSuperTile = this.rulesController.shouldSpawnSuperTile(this.gameModel, context)
    await this.destroyTileGroup(targets, clickedTile, shouldSpawnSuperTile)
    return this.onAfterDestroy()
  }

  private async destroyTileGroup(
    group: TTileData[],
    clickedTile: TTileData,
    shouldSpawnSuperTile = false,
  ): Promise<void> {
    this.boardModel.remove(group)
    await this.boardView.removeTiles(group)
    const score = this.scoreController.calculate(group.length)
    this.gameModel.addScore(score)
    this.uiController.render(this.createHudViewModel())
    if (shouldSpawnSuperTile) {
      const { x, y } = clickedTile
      const superTile = this.spawnController.createSuperTile(x, y)
      this.boardModel.grid[y][x] = superTile
      this.boardView.spawnTile(superTile, false)
    }
  }

  private spendResourcesForAction(action: TInputAction) {
    this.gameModel.spendTurn()
    switch (action.type) {
      case 'bombTileClick':
        this.gameModel.spendBombBooster()
    }
  }
  private async shuffleBoard() {
    if (!this.boardModel) {
      console.log(`Round not initialized yet, nothing to shuffle`)
      return
    }
    const moves = this.boardModel.shuffle()
    const animationPromises = moves.map((move) => this.boardView.animateSwap(move.tileFrom, move.tileTo))
    return Promise.all(animationPromises)
  }
  private syncInputView(previous: TInputState, current: TInputState) {
    if (previous.type === 'swap' && previous.firstTile) {
      this.boardView.setTileSelected(previous.firstTile, false)
    }

    if (current.type === 'swap' && current.firstTile) {
      this.boardView.setTileSelected(current.firstTile, true)
    }

    this.uiController.setSelectedBooster(inputStateToSelectedBooster(current))
  }

  private createHudViewModel(): THudViewModel {
    return {
      score: this.gameModel.score,
      targetScore: this.gameModel.targetScore,
      numTurnsLeft: this.gameModel.numTurnsLeft,
      numBombBoosters: this.gameModel.numBombBoosters,
      numTeleportBoosters: this.gameModel.numTeleportBoosters,
    }
  }

  private gatherDefaultTargets(tile: TTileData): TTileData[] {
    switch (tile.type) {
      case TileType.Regular:
        return this.matchController.findGroup(this.boardModel, tile)

      case TileType.SuperRow:
      case TileType.SuperColumn:
      case TileType.SuperBomb:
      case TileType.SuperAll:
        return this.specialTileController.getTargets(this.boardModel, tile, this.gameModel)
    }
  }
  private gatherDestroyTargets(tile: TTileData, action: TInputAction): TTileData[] {
    switch (action.type) {
      case 'defaultTileClick':
        return this.gatherDefaultTargets(tile)

      case 'bombTileClick':
        return this.boosterController.getBombTargets(this.boardModel, tile, this.config.bombRadius)

      default:
        return []
    }
  }
}
