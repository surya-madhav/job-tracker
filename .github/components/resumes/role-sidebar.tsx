'use client';

import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ChevronRight, 
  ChevronDown, 
  FolderTree, 
  Plus, 
  MoreVertical,
  Pencil,
  Trash
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TreeNode {
  id: string;
  name: string;
  children: TreeNode[];
  isExpanded?: boolean;
  isEditing?: boolean;
}

interface RoleSidebarProps {
  selectedRole: string | null;
  onRoleSelect: (role: string) => void;
}

export function RoleSidebar({ selectedRole, onRoleSelect }: RoleSidebarProps) {
  const [treeData, setTreeData] = useState<TreeNode[]>([
    {
      id: 'software',
      name: 'Software Development',
      children: [
        {
          id: 'frontend',
          name: 'Frontend',
          children: [
            {
              id: 'react-dev',
              name: 'React Developer',
              children: []
            },
            {
              id: 'angular-dev',
              name: 'Angular Developer',
              children: []
            }
          ]
        },
        {
          id: 'backend',
          name: 'Backend',
          children: [
            {
              id: 'node-dev',
              name: 'Node.js Developer',
              children: []
            },
            {
              id: 'java-dev',
              name: 'Java Developer',
              children: []
            }
          ]
        }
      ]
    },
    {
      id: 'data',
      name: 'Data Science',
      children: [
        {
          id: 'ml',
          name: 'Machine Learning',
          children: []
        },
        {
          id: 'data-analytics',
          name: 'Data Analytics',
          children: []
        }
      ]
    }
  ]);

  const toggleNode = (nodeId: string) => {
    const updateNode = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, isExpanded: !node.isExpanded };
        }
        if (node.children.length > 0) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });
    };
    setTreeData(updateNode(treeData));
  };

  const addNode = (parentId: string | null) => {
    const newNode: TreeNode = {
      id: crypto.randomUUID(),
      name: 'New Role',
      children: [],
      isEditing: true
    };

    if (!parentId) {
      setTreeData([...treeData, newNode]);
      return;
    }

    const updateNode = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        if (node.id === parentId) {
          return { 
            ...node, 
            children: [...node.children, newNode],
            isExpanded: true 
          };
        }
        if (node.children.length > 0) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });
    };
    setTreeData(updateNode(treeData));
  };

  const updateNodeName = (nodeId: string, name: string) => {
    const updateNode = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, name, isEditing: false };
        }
        if (node.children.length > 0) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });
    };
    setTreeData(updateNode(treeData));
  };

  const deleteNode = (nodeId: string) => {
    const filterNode = (nodes: TreeNode[]): TreeNode[] => {
      return nodes
        .filter(node => node.id !== nodeId)
        .map(node => ({
          ...node,
          children: filterNode(node.children)
        }));
    };
    setTreeData(filterNode(treeData));
  };

  const renderNode = (node: TreeNode, level: number = 0) => {
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.id} className="select-none">
        <div 
          className={`
            flex items-center gap-2 py-1 px-2 rounded-md
            hover:bg-accent/50 cursor-pointer
            ${selectedRole === node.id ? 'bg-accent' : ''}
          `}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
            >
              {node.isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          {!hasChildren && <div className="w-4" />}
          
          {node.isEditing ? (
            <Input
              value={node.name}
              autoFocus
              className="h-6 py-0"
              onChange={(e) => updateNodeName(node.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateNodeName(node.id, (e.target as HTMLInputElement).value);
                }
              }}
              onBlur={(e) => updateNodeName(node.id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <>
              <span 
                className="flex-1"
                onClick={() => onRoleSelect(node.id)}
              >
                {node.name}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => addNode(node.id)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Child
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    const updateNode = (nodes: TreeNode[]): TreeNode[] => {
                      return nodes.map(n => ({
                        ...n,
                        isEditing: n.id === node.id ? true : n.isEditing,
                        children: updateNode(n.children)
                      }));
                    };
                    setTreeData(updateNode(treeData));
                  }}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => deleteNode(node.id)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
        
        {hasChildren && node.isExpanded && (
          <div className="ml-4">
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 border-r bg-muted/30">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <FolderTree className="h-4 w-4" />
            Role Templates
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => addNode(null)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-2">
          {treeData.map(node => renderNode(node))}
        </div>
      </ScrollArea>
    </div>
  );
}