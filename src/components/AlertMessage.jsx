import { GoAlertFill } from "react-icons/go";

function AlertMessage({message, colorLeftBorder, colorBg, colorText, colorIcon}) {
  return (
    <div className={`relative rounded-none border-l-4 ${colorLeftBorder ?? "border-red-600"} ${colorBg ?? "bg-red-600/10"} font-medium ${colorText ?? "text-red-600"} mb-2 w-full py-3 h-[48px]`}>
        <GoAlertFill size="1.5em" color={colorIcon ?? "red"} className="absolute left-0 ml-3" />
        <p className="px-12">{message}</p>
    </div>
  )
}

export default AlertMessage