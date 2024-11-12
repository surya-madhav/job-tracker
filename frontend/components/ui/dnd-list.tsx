'use client';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface DndListProps {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  onReorder: (sourceIndex: number, destinationIndex: number) => void;
  droppableId: string;
}

export function DndList({ items, renderItem, onReorder, droppableId }: DndListProps) {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex === destinationIndex) return;
    
    onReorder(sourceIndex, destinationIndex);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {items.map((item, index) => (
              <Draggable
                key={item.id}
                draggableId={item.id}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {renderItem(item, index)}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}