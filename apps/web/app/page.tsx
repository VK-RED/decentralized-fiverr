import { Task } from "@repo/ui/task";
import { UploadImage } from "@repo/ui/uploadImage";

export default function Page(){
  return (
    <div className="flex flex-col items-center">
      <Task className="mt-10"/>
      <UploadImage className="mt-8"/>
    </div>
  )
}