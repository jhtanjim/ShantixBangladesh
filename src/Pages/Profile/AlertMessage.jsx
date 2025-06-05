import React from 'react'
import { AlertCircle } from 'lucide-react'

const AlertMessage = ({ type, message }) => {
  const styles = {
    success: {
      container: "bg-green-50 border-green-200",
      icon: "w-4 h-4 bg-green-500 rounded-full",
      text: "text-green-800"
    },
    error: {
      container: "bg-red-50 border-red-200",
      icon: <AlertCircle className="w-4 h-4 text-red-500" />,
      text: "text-red-800"
    }
  }

  const style = styles[type] || styles.error

  return (
    <div className={`mb-6 p-4 ${style.container} border rounded-lg flex items-center gap-2`}>
      {typeof style.icon === 'string' ? (
        <div className={style.icon}></div>
      ) : (
        style.icon
      )}
      <span className={style.text}>{message}</span>
    </div>
  )
}

export default AlertMessage