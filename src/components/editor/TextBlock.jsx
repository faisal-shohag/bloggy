import { Bold, Italic, Underline, Palette, Code } from "lucide-react";
import { useRef, useState } from "react";

const TextBlock = () => {
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    code: false,
  });
  const [currentFont, setCurrentFont] = useState('Arial');
  const [currentColor, setCurrentColor] = useState('#000000');
  
  const menuRef = useRef(null);
  const editableRef = useRef(null);
  const colorPickerRef = useRef(null);

  const fonts = [
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Times New Roman', value: 'Times New Roman, serif' },
    { name: 'Helvetica', value: 'Helvetica, sans-serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
    { name: 'Courier New', value: 'Courier New, monospace' },
    { name: 'Comic Sans MS', value: 'Comic Sans MS, cursive' },
    { name: 'Impact', value: 'Impact, fantasy' },
    { name: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
    { name: 'Palatino', value: 'Palatino, serif' }
  ];

  const findCodeElement = (node) => {
    let current = node;
    while (current && current !== editableRef.current) {
      if (current.tagName?.toLowerCase() === 'code' || 
          current.classList?.contains('code-format')) {
        return current;
      }
      current = current.parentNode;
    }
    return null;
  };

  const checkExistingFormat = (format) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return false;

    const range = selection.getRangeAt(0);
    let node = range.commonAncestorContainer;
    
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }

    if (format === 'code') {
      return !!findCodeElement(node);
    }

    const checkNode = (currentNode) => {
      while (currentNode && currentNode !== editableRef.current) {
        const computedStyle = window.getComputedStyle(currentNode);
        if (format === 'bold' && (computedStyle.fontWeight === 'bold' || parseInt(computedStyle.fontWeight) >= 700)) {
          return true;
        }
        if (format === 'italic' && computedStyle.fontStyle === 'italic') {
          return true;
        }
        if (format === 'underline' && computedStyle.textDecoration.includes('underline')) {
          return true;
        }

        const style = currentNode.style;
        if (style) {
          if (format === 'bold' && (style.fontWeight === 'bold' || style.fontWeight === '700')) return true;
          if (format === 'italic' && style.fontStyle === 'italic') return true;
          if (format === 'underline' && style.textDecoration.includes('underline')) return true;
        }

        const tagName = currentNode.tagName?.toLowerCase();
        if (format === 'bold' && (tagName === 'b' || tagName === 'strong')) return true;
        if (format === 'italic' && (tagName === 'i' || tagName === 'em')) return true;
        if (format === 'underline' && tagName === 'u') return true;

        currentNode = currentNode.parentNode;
      }
      return false;
    };

    return checkNode(node);
  };

  const getCurrentFont = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return 'Arial';

    const range = selection.getRangeAt(0);
    let node = range.commonAncestorContainer;
    
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }

    while (node && node !== editableRef.current) {
      const computedStyle = window.getComputedStyle(node);
      const fontFamily = computedStyle.fontFamily;
      if (fontFamily && fontFamily !== 'initial') {
        const font = fonts.find(f => fontFamily.includes(f.name));
        return font ? font.name : 'Arial';
      }
      node = node.parentNode;
    }
    return 'Arial';
  };

  const getCurrentColor = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return '#000000';

    const range = selection.getRangeAt(0);
    let node = range.commonAncestorContainer;
    
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }

    while (node && node !== editableRef.current) {
      if (node.style && node.style.color) {
        return rgbToHex(node.style.color) || node.style.color;
      }
      
      const computedStyle = window.getComputedStyle(node);
      const color = computedStyle.color;
      if (color && color !== 'rgb(0, 0, 0)' && color !== 'initial') {
        return rgbToHex(color) || color;
      }
      
      node = node.parentNode;
    }
    return '#000000';
  };

  const rgbToHex = (rgb) => {
    if (!rgb || rgb === 'initial') return null;
    
    if (rgb.startsWith('#')) return rgb.toUpperCase();
    
    const rgbMatch = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('').toUpperCase();
    }
    
    return null;
  };

  const updateActiveFormats = () => {
    setActiveFormats({
      bold: checkExistingFormat('bold'),
      italic: checkExistingFormat('italic'),
      underline: checkExistingFormat('underline'),
      code: checkExistingFormat('code')
    });
    setCurrentFont(getCurrentFont());
    setCurrentColor(getCurrentColor());
  };

  const applyCodeFormat = (isFormatted) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    
    if (isFormatted) {
      // Remove code formatting
      const node = range.commonAncestorContainer.nodeType === Node.TEXT_NODE 
        ? range.commonAncestorContainer.parentNode 
        : range.commonAncestorContainer;

      const codeElement = findCodeElement(node);
      
      if (codeElement && codeElement !== editableRef.current) {
        // Get the text content and create a text node
        const textContent = codeElement.textContent;
        const textNode = document.createTextNode(textContent);
        
        // Replace the code element with the text node
        codeElement.parentNode.replaceChild(textNode, codeElement);
        
        // Create new selection around the text
        const newRange = document.createRange();
        newRange.selectNodeContents(textNode);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    } else {
      // Apply code formatting
      if (range.collapsed || range.toString().trim() === '') return;
      
      const codeElement = document.createElement('code');
      codeElement.className = 'inline-code';
    //   codeElement.style.fontFamily = 'Courier New, monospace';
    //   codeElement.style.backgroundColor = '#f1f5f9';
    //   codeElement.style.padding = '2px 4px';
    //   codeElement.style.borderRadius = '4px';
    //   codeElement.style.fontSize = '0.9em';

      try {
        // Extract the contents and wrap them
        const contents = range.extractContents();
        codeElement.appendChild(contents);
        range.insertNode(codeElement);
        
        // Select the newly created code element
        const newRange = document.createRange();
        newRange.selectNodeContents(codeElement);
        selection.removeAllRanges();
        selection.addRange(newRange);
      } catch (e) {
        console.error('Error applying code format:', e);
      }
    }
  };

  const applyFormat = (format) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (selectedText.trim() === '') return;

    const isFormatted = checkExistingFormat(format);
    
    if (format === 'code') {
      applyCodeFormat(isFormatted);
    } else {
      if (isFormatted) {
        document.execCommand('removeFormat');
        
        const tempFormats = {
          bold: format !== 'bold' && activeFormats.bold,
          italic: format !== 'italic' && activeFormats.italic,
          underline: format !== 'underline' && activeFormats.underline,
        };

        if (tempFormats.bold) document.execCommand('bold');
        if (tempFormats.italic) document.execCommand('italic');
        if (tempFormats.underline) document.execCommand('underline');
        
      } else {
        if (format === 'bold') document.execCommand('bold');
        if (format === 'italic') document.execCommand('italic');
        if (format === 'underline') document.execCommand('underline');
      }
    }

    setTimeout(() => {
      updateActiveFormats();
    }, 10);
  };

  const applyFont = (fontFamily) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const selectedText = selection.toString();
    if (selectedText.trim() === '') return;

    document.execCommand('fontName', false, fontFamily);
    setCurrentFont(fontFamily.split(',')[0]);
    editableRef.current.focus();
  };

  const applyColor = (color) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (selectedText.trim() === '') return;

    document.execCommand('foreColor', false, color);
    
    setCurrentColor(color);
    editableRef.current.focus();
    
    setTimeout(() => {
      updateActiveFormats();
    }, 10);
  };

  const onSelectEditable = () => {
    const selection = window.getSelection();
    const textContent = selection?.toString();

    if (textContent && textContent.trim() !== '') {
      updateActiveFormats();
      setShowEditMenu(true);
    } else if (showEditMenu) {
      setShowEditMenu(false);
      setActiveFormats({ bold: false, italic: false, underline: false, code: false });
    }
  };

  const onInputEditable = (e) => {
    if (e.target.innerHTML.trim() === "<br>") {
      e.target.innerHTML = "";
    }
  };

  const onBlurCapture = (e) => {
    const relatedTarget = e.relatedTarget;
    if (
      menuRef.current?.contains(relatedTarget) ||
      editableRef.current?.contains(relatedTarget) ||
      colorPickerRef.current?.contains(relatedTarget)
    ) {
      return;
    }
    setShowEditMenu(false);
    setActiveFormats({ bold: false, italic: false, underline: false, code: false });
  };

  const handleFormatClick = (format) => (e) => {
    e.preventDefault();
    applyFormat(format);
    editableRef.current.focus();
  };

  const handleFontChange = (e) => {
    const fontValue = e.target.value;
    applyFont(fontValue);
  };

  const handleColorChange = (e) => {
    const color = e.target.value;
    applyColor(color);
  };

  return (
    <div className="relative">
      {showEditMenu && (
        <div
          ref={menuRef}
          tabIndex={-1}
          className="absolute -top-12 flex items-center gap-1 shadow-xl border border-gray-300 rounded-lg bg-white dark:bg-zinc-900 px-3 py-2 z-20"
        >
          <select
            defaultValue={currentFont}
            onChange={handleFontChange}
            className="cursor-pointer bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded px-2 py-1 text-sm focus:outline-none"
            title="Font Family"
          >
            {fonts.map((font) => (
              <option
                key={font.name}
                value={font.value}
                style={{ fontFamily: font.value }}
              >
                {font.name}
              </option>
            ))}
          </select>

          <div className="relative flex items-center">
            <input
              type="color"
              ref={colorPickerRef}
              value={currentColor}
              onChange={handleColorChange}
              onMouseDown={(e) => e.preventDefault()}
              className="w-8 h-8 p-0 border-none cursor-pointer bg-transparent"
              title="Text Color"
            />
            <Palette size={16} className="absolute left-1 pointer-events-none" />
          </div>

          <div className="h-6 w-px bg-gray-300 dark:bg-zinc-600 mx-1"></div>

          <button
            className={`cursor-pointer px-2 py-1 rounded transition-colors ${
              activeFormats.bold 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'hover:bg-gray-300 dark:hover:bg-zinc-700'
            }`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleFormatClick('bold')}
            title="Toggle Bold"
          >
            <Bold size={16} />
          </button>
          <button
            className={`cursor-pointer px-2 py-1 rounded transition-colors ${
              activeFormats.italic 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'hover:bg-gray-300 dark:hover:bg-zinc-700'
            }`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleFormatClick('italic')}
            title="Toggle Italic"
          >
            <Italic size={16} />
          </button>
          <button
            className={`cursor-pointer px-2 py-1 rounded transition-colors ${
              activeFormats.underline 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'hover:bg-gray-300 dark:hover:bg-zinc-700'
            }`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleFormatClick('underline')}
            title="Toggle Underline"
          >
            <Underline size={16} />
          </button>
          <button
            className={`cursor-pointer px-2 py-1 rounded transition-colors ${
              activeFormats.code 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'hover:bg-gray-300 dark:hover:bg-zinc-700'
            }`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleFormatClick('code')}
            title="Toggle Code"
          >
            <Code size={16} />
          </button>
        </div>
      )}

      <div
        ref={editableRef}
        onSelect={onSelectEditable}
        onInput={onInputEditable}
        onBlurCapture={onBlurCapture}
        placeholder="Write here..."
        className="focus:outline-0 min-h-[100px] p-2 border border-gray-200 rounded"
        contentEditable={true}
        tabIndex={0}
      ></div>
    </div>
  );
};

export default TextBlock;