import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Loading() {
  const navigate = useNavigate();

  useEffect(() => {
    // fake delay and move to login
    setTimeout(() => {
      navigate("/login");
    }, 2000)
  }, [])

  return <div>
    // TODO: loading spinner
  </div>
}