import { useState } from "react"
import PickARole from "../components/PageComponents/SignUp/PickARole"
import SignupUser from "../components/PageComponents/SignUp/SignupUser"

// normal user signUp
const SignUp = () => {
    const [stages, setStages] = useState(0)
    const [role, setRole] = useState<'Business' | 'Customer'>()

    return (
        <div className="min-h-screen w-full flex justify-center pt-[200px]">
            {stages === 0 && 
                <PickARole role={role} setRole={setRole} setStage={setStages} />
            }
            {stages === 1 && <div>
                <SignupUser role={role} />
            </div>}
        </div>
    )
}

export default SignUp