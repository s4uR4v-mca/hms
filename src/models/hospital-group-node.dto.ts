export interface HospitalGroupNode {
  id: string
  label: string
  children?: HospitalGroupNode[]
  isExpanded?: boolean
}
