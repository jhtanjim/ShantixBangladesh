import React from 'react'
import { useAuth } from '../Context/AuthContext'

const useUserRole = () => {
  const { user } = useAuth()
  return (
    <div>
      {/* You can return something meaningful here, or convert this to a hook that returns data */}
    </div>
  )
}

export default useUserRole
