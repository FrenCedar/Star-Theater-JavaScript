import sys
import tkinter as tk
from tkinter import filedialog, messagebox, ttk
import os

# Install pypdf if not available
try:
    import pypdf
except ImportError:
    print("Installing pypdf...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf"])
    import pypdf


class PDFMergerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("PDF Merger & Text Converter")
        self.root.geometry("700x550")
        self.root.resizable(True, True)
        
        self.pdf_files = []
        self.output_file = ""
        
        self.create_widgets()
    
    def create_widgets(self):
        # Title
        title_label = tk.Label(
            self.root, 
            text="PDF Merger & Text Converter",
            font=("Arial", 16, "bold")
        )
        title_label.pack(pady=10)
        
        # Instructions
        instructions = tk.Label(
            self.root,
            text="1. Add PDF files  2. Set output location  3. Merge & Convert",
            font=("Arial", 10)
        )
        instructions.pack(pady=5)
        
        # File list frame
        list_frame = tk.Frame(self.root)
        list_frame.pack(pady=10, padx=20, fill=tk.BOTH, expand=True)
        
        tk.Label(list_frame, text="Selected PDF Files:", font=("Arial", 10, "bold")).pack(anchor=tk.W)
        
        # Listbox with scrollbar
        scrollbar = tk.Scrollbar(list_frame)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        self.file_listbox = tk.Listbox(
            list_frame,
            yscrollcommand=scrollbar.set,
            height=12,
            font=("Arial", 9)
        )
        self.file_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.config(command=self.file_listbox.yview)
        
        # Buttons frame
        btn_frame = tk.Frame(self.root)
        btn_frame.pack(pady=10)
        
        # Add PDFs button
        add_btn = tk.Button(
            btn_frame,
            text="➕ Add PDF Files",
            command=self.add_pdfs,
            font=("Arial", 10),
            bg="#4CAF50",
            fg="white",
            padx=10,
            pady=5
        )
        add_btn.grid(row=0, column=0, padx=5)
        
        # Remove selected button
        remove_btn = tk.Button(
            btn_frame,
            text="➖ Remove Selected",
            command=self.remove_selected,
            font=("Arial", 10),
            bg="#f44336",
            fg="white",
            padx=10,
            pady=5
        )
        remove_btn.grid(row=0, column=1, padx=5)
        
        # Move up button
        up_btn = tk.Button(
            btn_frame,
            text="⬆ Move Up",
            command=self.move_up,
            font=("Arial", 10),
            padx=10,
            pady=5
        )
        up_btn.grid(row=0, column=2, padx=5)
        
        # Move down button
        down_btn = tk.Button(
            btn_frame,
            text="⬇ Move Down",
            command=self.move_down,
            font=("Arial", 10),
            padx=10,
            pady=5
        )
        down_btn.grid(row=0, column=3, padx=5)
        
        # Clear all button
        clear_btn = tk.Button(
            btn_frame,
            text="🗑 Clear All",
            command=self.clear_all,
            font=("Arial", 10),
            padx=10,
            pady=5
        )
        clear_btn.grid(row=0, column=4, padx=5)
        
        # Output file frame
        output_frame = tk.Frame(self.root)
        output_frame.pack(pady=10, padx=20, fill=tk.X)
        
        tk.Label(output_frame, text="Output File:", font=("Arial", 10, "bold")).pack(anchor=tk.W)
        
        output_entry_frame = tk.Frame(output_frame)
        output_entry_frame.pack(fill=tk.X, pady=5)
        
        self.output_entry = tk.Entry(output_entry_frame, font=("Arial", 9))
        self.output_entry.pack(side=tk.LEFT, fill=tk.X, expand=True)
        
        browse_btn = tk.Button(
            output_entry_frame,
            text="Browse...",
            command=self.browse_output,
            font=("Arial", 9),
            padx=10
        )
        browse_btn.pack(side=tk.RIGHT, padx=(5, 0))
        
        # Convert button
        convert_btn = tk.Button(
            self.root,
            text="🚀 Merge PDFs & Convert to Text",
            command=self.merge_and_convert,
            font=("Arial", 12, "bold"),
            bg="#2196F3",
            fg="white",
            padx=20,
            pady=10
        )
        convert_btn.pack(pady=15)
        
        # Status bar
        self.status_var = tk.StringVar()
        self.status_var.set("Ready")
        status_bar = tk.Label(
            self.root,
            textvariable=self.status_var,
            bd=1,
            relief=tk.SUNKEN,
            anchor=tk.W,
            font=("Arial", 9)
        )
        status_bar.pack(side=tk.BOTTOM, fill=tk.X)
    
    def add_pdfs(self):
        files = filedialog.askopenfilenames(
            title="Select PDF Files",
            filetypes=[("PDF files", "*.pdf"), ("All files", "*.*")]
        )
        
        for file in files:
            if file not in self.pdf_files:
                self.pdf_files.append(file)
                self.file_listbox.insert(tk.END, os.path.basename(file))
        
        self.status_var.set(f"{len(self.pdf_files)} PDF(s) selected")
    
    def remove_selected(self):
        selection = self.file_listbox.curselection()
        if selection:
            index = selection[0]
            self.file_listbox.delete(index)
            self.pdf_files.pop(index)
            self.status_var.set(f"Removed file. {len(self.pdf_files)} PDF(s) remaining")
    
    def move_up(self):
        selection = self.file_listbox.curselection()
        if selection and selection[0] > 0:
            index = selection[0]
            # Swap in list
            self.pdf_files[index], self.pdf_files[index - 1] = \
                self.pdf_files[index - 1], self.pdf_files[index]
            # Swap in listbox
            item = self.file_listbox.get(index)
            self.file_listbox.delete(index)
            self.file_listbox.insert(index - 1, item)
            self.file_listbox.selection_set(index - 1)
    
    def move_down(self):
        selection = self.file_listbox.curselection()
        if selection and selection[0] < len(self.pdf_files) - 1:
            index = selection[0]
            # Swap in list
            self.pdf_files[index], self.pdf_files[index + 1] = \
                self.pdf_files[index + 1], self.pdf_files[index]
            # Swap in listbox
            item = self.file_listbox.get(index)
            self.file_listbox.delete(index)
            self.file_listbox.insert(index + 1, item)
            self.file_listbox.selection_set(index + 1)
    
    def clear_all(self):
        if messagebox.askyesno("Clear All", "Remove all PDF files from the list?"):
            self.pdf_files.clear()
            self.file_listbox.delete(0, tk.END)
            self.status_var.set("All files cleared")
    
    def browse_output(self):
        file = filedialog.asksaveasfilename(
            title="Save Output Text File",
            defaultextension=".txt",
            filetypes=[("Text files", "*.txt"), ("All files", "*.*")]
        )
        
        if file:
            self.output_file = file
            self.output_entry.delete(0, tk.END)
            self.output_entry.insert(0, file)
    
    def merge_and_convert(self):
        # Validate inputs
        if not self.pdf_files:
            messagebox.showerror("Error", "Please add at least one PDF file!")
            return
        
        output_file = self.output_entry.get().strip()
        if not output_file:
            messagebox.showerror("Error", "Please specify an output file!")
            return
        
        try:
            self.status_var.set("Merging PDFs...")
            self.root.update()
            
            # Create PDF merger (use PdfWriter for newer pypdf versions)
            try:
                merger = pypdf.PdfMerger()
            except AttributeError:
                # For pypdf >= 3.0, use PdfWriter
                merger = pypdf.PdfWriter()
            
            # Add all PDFs
            for i, pdf_file in enumerate(self.pdf_files):
                self.status_var.set(f"Adding PDF {i+1}/{len(self.pdf_files)}: {os.path.basename(pdf_file)}")
                self.root.update()
                
                # Try both API methods
                try:
                    merger.append(pdf_file)
                except AttributeError:
                    # For PdfWriter, use append_pages_from_reader
                    reader = pypdf.PdfReader(pdf_file)
                    for page in reader.pages:
                        merger.add_page(page)
            
            # Create temporary merged PDF
            import tempfile
            temp_pdf = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
            temp_pdf_path = temp_pdf.name
            temp_pdf.close()
            
            self.status_var.set("Writing merged PDF...")
            self.root.update()
            merger.write(temp_pdf_path)
            
            # Close merger if method exists
            if hasattr(merger, 'close'):
                merger.close()
            
            # Extract text from merged PDF
            self.status_var.set("Extracting text from merged PDF...")
            self.root.update()
            
            text_content = []
            with open(temp_pdf_path, 'rb') as pdf_file:
                reader = pypdf.PdfReader(pdf_file)
                total_pages = len(reader.pages)
                
                for i, page in enumerate(reader.pages, 1):
                    self.status_var.set(f"Processing page {i}/{total_pages}...")
                    self.root.update()
                    text = page.extract_text()
                    text_content.append(f"--- Page {i} ---\n{text}\n")
            
            # Write to output file
            self.status_var.set("Writing text file...")
            self.root.update()
            
            full_text = '\n'.join(text_content)
            with open(output_file, 'w', encoding='utf-8') as txt_file:
                txt_file.write(full_text)
            
            # Clean up temp file
            os.unlink(temp_pdf_path)
            
            # Success message
            messagebox.showinfo(
                "Success",
                f"Successfully merged {len(self.pdf_files)} PDF(s) and converted to text!\n\n"
                f"Output: {output_file}\n"
                f"Total pages: {total_pages}\n"
                f"Total characters: {len(full_text):,}"
            )
            
            self.status_var.set(f"✓ Complete! Saved to {output_file}")
            
        except Exception as e:
            messagebox.showerror("Error", f"An error occurred:\n\n{str(e)}")
            self.status_var.set("Error occurred")


def main():
    root = tk.Tk()
    app = PDFMergerApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
