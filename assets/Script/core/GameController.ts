import { BoardModel } from '../board/models/BoardModel'
import { GameModel, TGameStatus } from '../gameplay/models/GameModel'
import { BoardView } from '../board/views/BoardView'
import { GravityController } from '../board/controllers/GravityController'
import { MatchController } from '../board/controllers/MatchController'
import { SpawnController } from '../board/controllers/SpawnController'
import { UIController } from '../ui/controllers/UIController'
import { Events } from './EventEmitter'
import { TileData, TileType } from '../board/models/TileData'
import { BoosterController } from '../gameplay/controllers/BoosterController'
import {
  InputController,
  TDestroyAction,
  TInputAction,
  TInputState,
  TSwapAction,
} from '../gameplay/controllers/InputController'
import { RulesController } from '../gameplay/controllers/RulesController'
import { ScoreController } from '../gameplay/controllers/ScoreController'
import { SpecialTileController } from '../gameplay/controllers/SpecialTilesController'
import Board from '../board/components/Board'
import UIRoot from '../ui/components/UIRoot'
import { TDifficulty, TRoundConfig } from '../shared/types'
import { BASE_DIFFICULTIES, DEFAULT_CONFIG } from '../shared/constants'
import { inputStateToSelectedBooster } from './utils'
import { TDestroyContext } from '../gameplay/types'

export type TTurnState = `idle` | `processing` | `finished`
export class GameController {
  private boardModel!: BoardModel<TileData>
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
  private readonly onClickWithContext = this.handleTileClick.bind(this)
  private turnState: TTurnState = `idle`

  constructor(
    private readonly boardFrame: Board,
    private readonly uiRootFrame: UIRoot,
  ) {
    this.boardView = new BoardView(this.boardFrame)
    this.uiController = new UIController(this.uiRootFrame)
    this.uiController.onBombButtonClick = () => this.handleBombButtonClick()
    this.uiController.onSwapButtonClick = () => this.handleTeleportButtonClick()
    this.uiController.setLevelSelectOnClickHandler({
      easy: () => this.onDifficultySelected(`easy`),
      medium: () => this.onDifficultySelected(`medium`),
      hard: () => this.onDifficultySelected(`hard`),
    })
    this.uiController.disableGameUI()
    ;(window as any)[`shuffle`] = this.shuffleBoard.bind(this)
  }
  async initializeGame() {
    return this.uiController.playLevelSelectPanelSpawnAnimation()
  }
  private async onDifficultySelected(mode: TDifficulty) {
    const config = BASE_DIFFICULTIES[mode]
    this.config = config
    await this.uiController.playLevelSelectPanelDeSpawnAnimation()
    return this.initializeRound()
  }
  private async initializeRound() {
    this.boardModel = new BoardModel<TileData>(this.config.boardWidth, this.config.boardHeight)

    this.gameModel = new GameModel(this.config)
    this.uiController.render(this.gameModel)
    await this.boardView.playSpawnAnimation()
    await this.uiController.playRoundUISpawnAnimation()

    this.boardView.reset({
      width: this.boardModel.widthTiles,
      height: this.boardModel.heightTiles,
    })
    this.spawnController.createInitialCells(this.boardModel, this.gameModel.difficultySettings)
    await this.boardView.renderByRows(this.boardModel)
    this.turnState = `idle`
    this.subscribeToEvents()
    this.uiController.enableGameUI()
  }

  private syncInputView(previous: TInputState, current: TInputState): void {
    if (previous.type === 'swap' && previous.firstTile) {
      this.boardView.setTileSelected(previous.firstTile, false)
    }

    if (current.type === 'swap' && current.firstTile) {
      this.boardView.setTileSelected(current.firstTile, true)
    }

    this.uiController.setSelectedBooster(inputStateToSelectedBooster(current))
  }

  private async shuffleBoard() {
    const moves = this.boardModel.shuffle()
    const animationPromises = moves.map((move) => this.boardView.animateSwap(move.tileFrom, move.tileTo))
    return Promise.all(animationPromises)
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

    this.uiController.render(this.gameModel)

    return this.onFinishTurn()
  }
  private handleBombButtonClick(): void {
    if (this.turnState !== 'idle') return

    const previousState = this.inputController.getState()

    if (previousState.type === 'bomb') {
      this.inputController.setDefault()
    } else if (this.gameModel.numBombBoosters > 0) {
      this.inputController.enableBomb()
    }

    this.syncInputView(previousState, this.inputController.getState())
  }
  private handleTeleportButtonClick(): void {
    if (this.turnState !== 'idle') return

    const previousState = this.inputController.getState()

    if (previousState.type === 'swap') {
      this.inputController.setDefault()
    } else if (this.gameModel.numTeleportBoosters > 0) {
      this.inputController.enableSwap()
    }

    this.syncInputView(previousState, this.inputController.getState())
  }
  private async handleTileClick(tile: TileData): Promise<void> {
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
  private async executeDestroyAction(action: TDestroyAction) {
    this.turnState = `processing`
    const { tile } = action
    const targets = this.gatherDestroyTargets(tile, action)
    await this.applyDestroyAction(tile, targets, action)
    return this.onFinishTurn()
  }
  private selectSwapTile(tile: TileData) {
    this.boardView.setTileSelected(tile, true)
  }
  private deSelectSwapTile(tile: TileData) {
    this.boardView.setTileSelected(tile, false)
  }
  private async applyDestroyAction(clickedTile: TileData, targets: TileData[], action: TInputAction) {
    const context = this.createDestroyContext(action, clickedTile, targets)
    if (!this.rulesController.canDestroy(context)) {
      this.boardView.shakeTile(clickedTile)
      return
    }
    this.spendResourcesForAction(action)
    const shouldSpawnSuperTile = this.rulesController.shouldSpawnSuperTile(this.gameModel, context)
    await this.destroyTileGroup(targets, clickedTile, shouldSpawnSuperTile)
    return this.onAfterDestroy()
  }
  private spendResourcesForAction(action: TInputAction) {
    this.gameModel.spendTurn()
    switch (action.type) {
      case 'bombTileClick':
        this.gameModel.spendBombBooster()
    }
  }

  private createDestroyContext(action: TInputAction, clickedTile: TileData, targets: TileData[]): TDestroyContext {
    if (action.type === 'bombTileClick') {
      return {
        type: 'bombClick',
        targetsCount: targets.length,
      }
    }

    switch (clickedTile.type) {
      case TileType.Regular:
        return {
          type: 'regularClick',

          tileType: TileType.Regular,

          groupSize: targets.length,
        }

      case TileType.SuperRow:
      case TileType.SuperColumn:
      case TileType.SuperBomb:
      case TileType.SuperAll:
        return {
          type: 'regularClick',

          tileType: clickedTile.type,

          targetsCount: targets.length,
        }
    }
  }
  private gatherDefaultTargets(tile: TileData): TileData[] {
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
  private gatherDestroyTargets(tile: TileData, action: TInputAction): TileData[] {
    switch (action.type) {
      case 'defaultTileClick':
        return this.gatherDefaultTargets(tile)

      case 'bombTileClick':
        return this.boosterController.getBombTargets(this.boardModel, tile, this.config.bombRadius)

      default:
        return []
    }
  }

  private async destroyTileGroup(
    group: TileData[],
    clickedTile: TileData,
    shouldSpawnSuperTile = false,
  ): Promise<void> {
    this.boardModel.remove(group)
    await this.boardView.removeTiles(group)
    const score = this.scoreController.calculate(group.length)
    this.gameModel.addScore(score)
    this.uiController.render(this.gameModel)
    if (shouldSpawnSuperTile) {
      const { x, y } = clickedTile
      const superTile = this.spawnController.createSuperTile(x, y)
      this.boardModel.grid[y][x] = superTile
      this.boardView.spawnTile(superTile, false)
    }
  }

  private async onAfterDestroy() {
    const moves = this.gravityController.applyGravity(this.boardModel)

    this.spawnController.createAdditionalRegularCells(this.boardModel)

    const gravityPromise = this.boardView.animateGravity(moves)
    const spawnPromise = this.boardView.renderByRows(this.boardModel)
    await Promise.all([gravityPromise, spawnPromise])
    return Promise.resolve()
  }

  private checkGameResult() {
    const hasAvailableMoves = this.matchController.checkIsNoTurnsLeft(this.boardModel)
    return this.rulesController.getGameResult(this.gameModel, hasAvailableMoves)
  }
  private subscribeToEvents() {
    Events.on(`tileClicked`, this.onClickWithContext)
  }
  private unSubscribeFromEvents() {
    Events.off(`tileClicked`, this.onClickWithContext)
  }
  private canHandleInput(tile: TileData): boolean {
    const currentTile = this.boardModel.get(tile.x, tile.y)

    return this.gameModel.status === 'playing' && currentTile?.id === tile.id && this.turnState === `idle`
  }

  private async onFinishTurn() {
    const gameStatus = this.checkGameResult()
    if (gameStatus === `lose` && this.gameModel.boardShufflesLeft > 0 && this.gameModel.numTurnsLeft > 0) {
      await this.shuffleBoard()
      this.gameModel.spendBoardShuffle()
      this.turnState = `idle`
      return Promise.resolve()
    }
    if (gameStatus !== `playing`) {
      return this.onRoundFinished(gameStatus)
    }
    this.turnState = `idle`
    return Promise.resolve()
  }
  onResize() {}
  private async onRoundFinished(status: TGameStatus): Promise<void> {
    this.uiController.disableGameUI()
    this.gameModel.setStatus(status)
    this.turnState = `finished`
    this.uiController.render(this.gameModel)
    await this.uiController.showGameResult(status)
    return this.restart()
  }
  private async restart(): Promise<void> {
    await this.disposeRound()
    await this.initializeGame()
  }
  async disposeRound() {
    //TODO: remove current round state
    await this.uiController.playRoundUIDespawnAnimation()
    await this.boardView.clear()
    this.unSubscribeFromEvents()
  }
}
