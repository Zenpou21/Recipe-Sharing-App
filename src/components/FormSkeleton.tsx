import { Skeleton } from "@heroui/react";

export default function FormSkeleton() {
  return (
    <div className="space-y-3 w-full">
      <Skeleton className="rounded-lg">
        <div className="h-10 rounded-lg bg-default-200" />
      </Skeleton>
      <Skeleton className="rounded-lg">
        <div className="h-32 w-full rounded-lg bg-default-300" />
      </Skeleton>
      <div className="space-y-3 mt-10 ">
        <Skeleton className="rounded-lg">
          <div className="h-10 rounded-lg bg-default-200" />
        </Skeleton>
        <Skeleton className="rounded-lg">
          <div className="h-10 rounded-lg bg-default-200" />
        </Skeleton>
        <Skeleton className="rounded-lg">
          <div className="h-10 rounded-lg bg-default-300" />
        </Skeleton>
      </div>
    </div>
  );
}
