import { Board } from "./Board"
import { Category } from "./Category"
import { Workspace } from "./Workspace"

interface AllEntities {
  categories: Category[],
  boards: Board[],
  workspaces: Workspace[],
}

export { AllEntities }