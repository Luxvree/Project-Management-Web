import { AppLayout } from '@/components/layout/AppLayout';
import { KanbanBoard } from '@/components/board/KanbanBoard';

const Board = () => {
  return (
    <AppLayout title="Board">
      <div className="h-full">
        <KanbanBoard />
      </div>
    </AppLayout>
  );
};

export default Board;
