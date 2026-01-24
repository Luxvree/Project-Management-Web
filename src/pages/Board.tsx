import { AppLayout } from '@/components/layout/AppLayout';
import { KanbanBoard } from '@/components/board/KanbanBoard';

const Board = () => {
  return (
    <AppLayout title="Project">
      <div className="h-full">
        <KanbanBoard />
      </div>
    </AppLayout>
  );
};

export default Board;
