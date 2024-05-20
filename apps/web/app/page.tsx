import { Task } from "@repo/ui/task";
import { ImageHandler } from "@repo/ui/imageHandler";

export default function Page(){
  return (
    <div className="flex flex-col items-center">
      <Task className="mt-10"/>
      <ImageHandler/>
    </div>
  )
}