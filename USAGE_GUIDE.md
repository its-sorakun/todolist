# Note-Taking Guide & Best Practices

Welcome to your new digital notebook. This app is designed to be a fast, responsive iPad-like replacement that respects both raw Markdown and rich HTML layouts.

Here is how to get the most out of it:

## 1. The Dual Engine (Markdown ↔ Rich Text)
You have two modes at your disposal, which you can toggle at any time using the **"Raw MD" / "Rich Text"** button:
- **Rich Text View:** Best for reading, general typing, and visualizing complex layouts. What you see is what you get.
- **Raw Markdown View:** Best for pasting output directly from AI tools (like ChatGPT) or tweaking underlying HTML structures.

## 2. Formatting Text
Standard Markdown works flawlessly. 
- Use `#` for large titles, `##` and `###` for sub-sections. (Tip: The app's typography engine makes `##` look especially gorgeous).
- Use `**bold**` and `*italics*` for emphasis.
- Use `-` or `1.` for lists.

## 3. Handling Images
By default, standard Markdown images `![alt text](/path/to/image.jpg)` will expand to fit the full width of the editor.
If you want to manually size an image so it doesn't take up the whole screen, you must drop into HTML:
```html
<img src="/path/to/image.jpg" width="300" style="border-radius: 8px;" />
```

## 4. Advanced Side-by-Side Layouts (ChatGPT Style)
If you are generating complex, magazine-like layouts where images sit perfectly next to text, **do not rely on standard Markdown or CSS floats**—they are notoriously fragile.

Instead, use standard HTML Tables. The engine explicitly supports them and will persist them perfectly between loads.

**Example of a bulletproof side-by-side layout:**
```html
<table>
  <tbody>
    <tr>
      <td width="140" valign="top">
        <img src="/your_image.jpg" width="120" style="border-radius: 8px; object-fit: cover; aspect-ratio: 1/1;" />
      </td>
      <td valign="top">
        <h3>1. Your Heading</h3>
        <p>Your descriptive text wrapping nicely beside the image without any weird CSS overlapping bugs.</p>
      </td>
    </tr>
  </tbody>
</table>
```

## 5. Using AI to Write Notes
If you are using an AI (like ChatGPT or Claude) to generate notes for you, **always provide them with the `AI_WRITER_GUIDE.md`**. 
That file contains strict system prompts that force the AI to format its output using the HTML tables shown above, guaranteeing that when you paste its response into the Raw MD view, it renders perfectly in Rich Text.

## 6. Themes
Your notes are automatically styled by your selected theme. You can switch themes on the fly, and elements like headings, prose, and tables will adapt beautifully to the chosen aesthetic (Waifu, Dark, Sticky, Aesthetic).
