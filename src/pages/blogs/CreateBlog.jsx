import React, { useState } from 'react';
import { Bold, Italic, Underline, Strikethrough, Type, Palette, GripVertical, Plus, Heading1, Heading2, Image, Video, AlignLeft, Trash2 } from 'lucide-react';

const NotionBlogEditor = () => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [activeBlock, setActiveBlock] = useState(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

  const addBlock = (type) => {
    const newBlock = {
      id: Date.now(),
      type,
      content: '',
      styles: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        color: '#374151'
      }
    };
    setBlocks([...blocks, newBlock]);
    setShowBlockMenu(false);
  };

  const updateBlockContent = (id, content) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content } : block
    ));
  };

  const updateBlockStyles = (id, newStyles) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, styles: { ...block.styles, ...newStyles } } : block
    ));
  };

  const deleteBlock = (id) => {
    setBlocks(blocks.filter(block => block.id !== id));
    setActiveBlock(null);
    setShowToolbar(false);
  };

  const handleTextClick = (e, blockId) => {
    const rect = e.target.getBoundingClientRect();
    setActiveBlock(blockId);
    setToolbarPosition({
      top: rect.top - 60,
      left: rect.left
    });
    setShowToolbar(true);
  };

  const handleDragStart = (e, blockId) => {
    setDraggedBlock(blockId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', blockId.toString());
    
    // Add visual feedback
    setTimeout(() => {
      e.target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedBlock(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const draggedId = parseInt(e.dataTransfer.getData('text/plain'));
    if (!draggedId || draggedId === targetId) return;

    const draggedIndex = blocks.findIndex(block => block.id === draggedId);
    const targetIndex = blocks.findIndex(block => block.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const newBlocks = [...blocks];
    const draggedBlockData = newBlocks[draggedIndex];
    
    newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(targetIndex, 0, draggedBlockData);
    
    setBlocks(newBlocks);
    setDraggedBlock(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Blog Post:', { 
      title, 
      blocks, 
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag) 
    });
  };

  const renderBlock = (block) => {
    const isActive = activeBlock === block.id;
    const blockStyle = {
      fontFamily: block.styles.fontFamily,
      fontWeight: block.styles.fontWeight,
      fontStyle: block.styles.fontStyle,
      textDecoration: block.styles.textDecoration,
      color: block.styles.color
    };

    return (
      <div
        key={block.id}
     
        className={`group flex items-start gap-2 mb-3 p-2 rounded-lg transition-all duration-200 ${
          isActive ? 'bg-blue-50 ring-2 ring-blue-200' : 'hover:bg-gray-50'
        } ${draggedBlock === block.id ? 'opacity-50' : ''}`}
      >
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
             draggable
        onDragStart={(e) => handleDragStart(e, block.id)}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDrop={(e) => handleDrop(e, block.id)}
            // onMouseDown={(e) => e.preventDefault()}
            // onDragStart={(e) => e.stopPropagation()}
            className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing drag-handle"
          >
            <GripVertical size={16} />
          </button>
          <button
            onClick={() => deleteBlock(block.id)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="flex-1">
          {block.type === 'Heading' && (
            <input
              type="text"
              value={block.content}
              onChange={(e) => updateBlockContent(block.id, e.target.value)}
              onClick={(e) => handleTextClick(e, block.id)}
              placeholder="Heading"
              style={blockStyle}
              className="w-full  text-2xl font-bold bg-transparent border-none outline-none placeholder-gray-400 py-2"
            />
          )}
          {block.type === 'Subheading' && (
            <input
              type="text"
              value={block.content}
              onChange={(e) => updateBlockContent(block.id, e.target.value)}
              onClick={(e) => handleTextClick(e, block.id)}
              placeholder="Subheading"
              style={blockStyle}
              className="w-full text-lg font-semibold bg-transparent border-none outline-none placeholder-gray-400 py-2"
            />
          )}
          {block.type === 'Text' && (
            <textarea
              value={block.content}
              onChange={(e) => updateBlockContent(block.id, e.target.value)}
              onClick={(e) => handleTextClick(e, block.id)}
              placeholder="Start writing..."
              style={blockStyle}
              className="w-full bg-transparent border-none outline-none placeholder-gray-400 py-2 resize-none overflow-hidden"
              rows={1}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />
          )}
          {block.type === 'Image' && (
            <div className="space-y-2">
              <input
                type="text"
                value={block.content}
                onChange={(e) => updateBlockContent(block.id, e.target.value)}
                placeholder="Paste image URL..."
                className="w-full bg-transparent border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {block.content && (
                <img 
                  src={block.content} 
                  alt="Blog content" 
                  className="w-full max-w-md rounded-lg shadow-sm"
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
            </div>
          )}
          {block.type === 'Video' && (
            <div className="space-y-2">
              <input
                type="text"
                value={block.content}
                onChange={(e) => updateBlockContent(block.id, e.target.value)}
                placeholder="Paste video URL..."
                className="w-full bg-transparent border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {block.content && (
                <div className="w-full max-w-md">
                  <video 
                    src={block.content} 
                    controls 
                    className="w-full rounded-lg shadow-sm"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Fixed Toolbar */}
      {showToolbar && activeBlock && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex items-center gap-1"
          style={{
            top: `${toolbarPosition.top}px`,
            left: `${toolbarPosition.left}px`
          }}
        >
          <select
            value={blocks.find(b => b.id === activeBlock)?.styles.fontFamily || 'Inter'}
            onChange={(e) => updateBlockStyles(activeBlock, { fontFamily: e.target.value })}
            className="text-sm border border-gray-200 rounded px-2 py-1 outline-none"
          >
            <option value="Inter">Inter</option>
            <option value="serif">Serif</option>
            <option value="monospace">Mono</option>
            <option value="Georgia">Georgia</option>
          </select>
          
          <div className="w-px h-6 bg-gray-200 mx-1"></div>
          
          <button
            onClick={() => {
              const currentWeight = blocks.find(b => b.id === activeBlock)?.styles.fontWeight;
              updateBlockStyles(activeBlock, { fontWeight: currentWeight === 'bold' ? 'normal' : 'bold' });
            }}
            className={`p-2 rounded hover:bg-gray-100 ${
              blocks.find(b => b.id === activeBlock)?.styles.fontWeight === 'bold' ? 'bg-blue-100 text-blue-600' : ''
            }`}
          >
            <Bold size={16} />
          </button>
          
          <button
            onClick={() => {
              const currentStyle = blocks.find(b => b.id === activeBlock)?.styles.fontStyle;
              updateBlockStyles(activeBlock, { fontStyle: currentStyle === 'italic' ? 'normal' : 'italic' });
            }}
            className={`p-2 rounded hover:bg-gray-100 ${
              blocks.find(b => b.id === activeBlock)?.styles.fontStyle === 'italic' ? 'bg-blue-100 text-blue-600' : ''
            }`}
          >
            <Italic size={16} />
          </button>
          
          <button
            onClick={() => {
              const currentDecoration = blocks.find(b => b.id === activeBlock)?.styles.textDecoration;
              updateBlockStyles(activeBlock, { textDecoration: currentDecoration?.includes('underline') ? 'none' : 'underline' });
            }}
            className={`p-2 rounded hover:bg-gray-100 ${
              blocks.find(b => b.id === activeBlock)?.styles.textDecoration?.includes('underline') ? 'bg-blue-100 text-blue-600' : ''
            }`}
          >
            <Underline size={16} />
          </button>
          
          <button
            onClick={() => {
              const currentDecoration = blocks.find(b => b.id === activeBlock)?.styles.textDecoration;
              updateBlockStyles(activeBlock, { textDecoration: currentDecoration?.includes('line-through') ? 'none' : 'line-through' });
            }}
            className={`p-2 rounded hover:bg-gray-100 ${
              blocks.find(b => b.id === activeBlock)?.styles.textDecoration?.includes('line-through') ? 'bg-blue-100 text-blue-600' : ''
            }`}
          >
            <Strikethrough size={16} />
          </button>
          
          <div className="w-px h-6 bg-gray-200 mx-1"></div>
          
          <input
            type="color"
            value={blocks.find(b => b.id === activeBlock)?.styles.color || '#374151'}
            onChange={(e) => updateBlockStyles(activeBlock, { color: e.target.value })}
            className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
          />
        </div>
      )}

      {/* Click outside to hide toolbar */}
      {showToolbar && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowToolbar(false);
            setActiveBlock(null);
          }}
        />
      )}

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="mb-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            className="w-full text-4xl font-bold text-gray-900 bg-transparent border-none outline-none placeholder-gray-400"
          />
        </div>

        {/* Blocks */}
        <div className="space-y-1">
          {blocks.map((block, index) => renderBlock(block, index))}
        </div>

        {/* Add Block Button */}
        <div className="relative mt-4">
          <button
            onClick={() => setShowBlockMenu(!showBlockMenu)}
            className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Add a block</span>
          </button>
          
          {showBlockMenu && (
            <div className="absolute mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-30 overflow-hidden">
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2">Basic Blocks</div>
                <button
                  onClick={() => addBlock('Text')}
                  className="flex items-center gap-3 w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <AlignLeft size={16} />
                  <div>
                    <div className="font-medium">Text</div>
                    <div className="text-xs text-gray-500">Start writing with plain text</div>
                  </div>
                </button>
                <button
                  onClick={() => addBlock('Heading')}
                  className="flex items-center gap-3 w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Heading1 size={16} />
                  <div>
                    <div className="font-medium">Heading 1</div>
                    <div className="text-xs text-gray-500">Big section heading</div>
                  </div>
                </button>
                <button
                  onClick={() => addBlock('Subheading')}
                  className="flex items-center gap-3 w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Heading2 size={16} />
                  <div>
                    <div className="font-medium">Heading 2</div>
                    <div className="text-xs text-gray-500">Medium section heading</div>
                  </div>
                </button>
                
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2 mt-2">Media</div>
                <button
                  onClick={() => addBlock('Image')}
                  className="flex items-center gap-3 w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Image size={16} />
                  <div>
                    <div className="font-medium">Image</div>
                    <div className="text-xs text-gray-500">Upload or embed with a link</div>
                  </div>
                </button>
                <button
                  onClick={() => addBlock('Video')}
                  className="flex items-center gap-3 w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Video size={16} />
                  <div>
                    <div className="font-medium">Video</div>
                    <div className="text-xs text-gray-500">Embed from YouTube, Vimeo...</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Add tags (comma-separated)"
            className="w-full text-gray-700 bg-transparent border-none outline-none placeholder-gray-400 py-2"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Publish Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotionBlogEditor;