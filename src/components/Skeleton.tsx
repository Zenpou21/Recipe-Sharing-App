import {Card, Skeleton} from "@heroui/react";

export default function App() {
  return (
    <div className="grid grid-cols-5 gap-5 p-6">
      {Array.from({ length: 10 }).map((_, index) => (
        <Card key={index} className="w-full space-y-5 h-58" radius="sm">
          <Skeleton>
            <div className="h-24 rounded-lg bg-default-300" />
          </Skeleton>
          <div className="space-y-3 p-3">
            <Skeleton className="w-3/5 rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200" />
            </Skeleton>
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-3 w-4/5 rounded-lg bg-default-200" />
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-300" />
            </Skeleton>
          </div>
        </Card>
      ))}
    </div>
  );
}
