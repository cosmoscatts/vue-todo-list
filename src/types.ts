export interface TabItem {
  id: number
  title?: string
}

export interface TodoItem {
  id: number
  title?: string
  completed: boolean
}

export type Visibility = 'all' | 'active' | 'completed'
