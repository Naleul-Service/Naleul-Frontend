import { useState } from 'react'
import type { RetrospectiveResponse } from '../types'

type ModalState = { type: 'closed' } | { type: 'create' } | { type: 'edit'; data: RetrospectiveResponse }

export function useRetrospectiveModal() {
  const [modal, setModal] = useState<ModalState>({ type: 'closed' })

  const openCreate = () => setModal({ type: 'create' })
  const openEdit = (data: RetrospectiveResponse) => setModal({ type: 'edit', data })
  const close = () => setModal({ type: 'closed' })

  return { modal, openCreate, openEdit, close }
}
