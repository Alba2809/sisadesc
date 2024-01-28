import { GoAlertFill } from "react-icons/go";

function AlertMessage({message}) {
  return (
    <div className="relative rounded-none border-l-4 border-[#c92e2e] bg-[#c92e2e]/10 font-medium text-[#c92e2e] mb-2 w-full py-3 h-[48px]">
        <GoAlertFill size="1.5em" color="red" className="absolute left-0 ml-3" />
        <p className="px-12">{message}</p>
    </div>
  )
}

export default AlertMessage