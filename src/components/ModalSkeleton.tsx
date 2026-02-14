import { Skeleton } from "@heroui/react";

export default function ModalSkeleton() {
  return (
    <div className="">
      <Skeleton>
        <div className="h-58 w-96 rounded-lg bg-default-300" />
      </Skeleton>
      <div className="space-y-3 mt-3 p-3">
        <Skeleton className="w-3/5 rounded-lg">
          <div className="h-4 w-3/5 rounded-lg bg-default-200" />
        </Skeleton>
        <Skeleton className="w-4/5 rounded-lg">
          <div className="h-4 w-4/5 rounded-lg bg-default-200" />
        </Skeleton>
        <Skeleton className="w-2/5 rounded-lg">
          <div className="h-4 w-2/5 rounded-lg bg-default-300" />
        </Skeleton>
      </div>
    </div>
  );
}
