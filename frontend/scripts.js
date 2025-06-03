const form = document.getElementById('blog-form');
const input = document.getElementById('blog-input');
const blogsList = document.getElementById('blogs-list');

input.addEventListener('input', () => {
  input.style.height = 'auto';
  input.style.height = (input.scrollHeight) + 'px';
});

function formatTimestamp(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('he-IL', {
      timeZone: 'Asia/Jerusalem',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }
  
  async function loadBlogs() {
    const response = await fetch('http://localhost:3000/blogs');
    let blogs = await response.json();
  
    blogs = blogs.reverse();
  
    blogsList.innerHTML = '';
    blogs.forEach(blog => {
      const div = document.createElement('div');
      div.className = 'blog';
  
      const textDiv = document.createElement('div');
      textDiv.textContent = blog.text;
      textDiv.className = 'blog-text';
  
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.className = 'edit-btn';
      editBtn.onclick = () => {
        startEdit(blog, div, textDiv);
      };
  
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'delete-btn';
      deleteBtn.onclick = () => {
        deleteBlog(blog.id);
      };
  
      const timestampDiv = document.createElement('div');
      timestampDiv.textContent = formatTimestamp(blog.timestamp);
      timestampDiv.className = 'timestamp';

      div.appendChild(textDiv);
      div.appendChild(editBtn);
      div.appendChild(deleteBtn);
      div.appendChild(timestampDiv);
      blogsList.appendChild(div);
    });
  }  

function startEdit(blog, blogDiv, textDiv) {
  const textarea = document.createElement('textarea');
  textarea.value = blog.text;
  textarea.rows = 3;
  textarea.style.width = '100%';
  textarea.style.fontSize = '1rem';
  textarea.style.padding = '0.5rem';
  textarea.style.borderRadius = '4px';
  textarea.style.border = '1px solid #ccc';
  textarea.style.resize = 'none';
  textarea.style.overflow = 'hidden';
  textarea.style.fontFamily = 'monospace';
  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
  });

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.className = 'save-btn';
  saveBtn.onclick = async () => {
    await updateBlog(blog.id, textarea.value.trim());
    loadBlogs();
  };

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.className = 'cancel-btn';
  cancelBtn.onclick = () => {
    blogDiv.replaceChild(textDiv, textarea);
    blogDiv.removeChild(saveBtn);
    blogDiv.removeChild(cancelBtn);
    blogDiv.appendChild(editBtn);
    blogDiv.appendChild(deleteBtn);
  };

  const editBtn = blogDiv.querySelector('.edit-btn');
  const deleteBtn = blogDiv.querySelector('.delete-btn');

  blogDiv.replaceChild(textarea, textDiv);
  blogDiv.removeChild(editBtn);
  blogDiv.removeChild(deleteBtn);
  blogDiv.appendChild(saveBtn);
  blogDiv.appendChild(cancelBtn);

  textarea.style.height = 'auto';
  textarea.style.height = (textarea.scrollHeight) + 'px';
}

async function deleteBlog(id) {
  await fetch(`http://localhost:3000/blogs/${id}`, { method: 'DELETE' });
  loadBlogs();
}

async function updateBlog(id, text) {
  if (!text) return;
  await fetch(`http://localhost:3000/blogs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  await fetch('http://localhost:3000/blogs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  input.value = '';
  input.style.height = 'auto';
  loadBlogs();
});

loadBlogs();
