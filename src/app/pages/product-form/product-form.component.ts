import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms'; // <--- FormsModule Importante
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service'; // <--- Service Importado
import { Category } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule], // <--- FormsModule adicionado
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {

  form: FormGroup;
  isEditMode = false;
  productId: string | null = null;
  categories: Category[] = [];

  // --- VARIÁVEIS QUE FALTAVAM ---
  isCreatingCategory = false;
  newCategoryName = '';
  isSavingCategory = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService, // <--- Injeção do Service
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      brand: ['', Validators.required],
      categoryId: [null, Validators.required],
      active: [true],
      images: this.fb.array([]),
      variations: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadCategories(); // Busca categorias reais do banco

    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.loadProduct(this.productId);
    } else {
      // Criação: Adiciona campos iniciais para facilitar
      this.addVariation();
      this.addImage();
    }
  }

  // --- GETTERS ---
  get imagesArray() { return this.form.get('images') as FormArray; }
  get variationsArray() { return this.form.get('variations') as FormArray; }

  // --- IMAGENS ---
  createImageGroup(): FormGroup {
    return this.fb.group({ imageUrl: ['', Validators.required], main: [false] });
  }
  addImage() { this.imagesArray.push(this.createImageGroup()); }
  removeImage(index: number) { this.imagesArray.removeAt(index); }
  setMainImage(index: number) {
    this.imagesArray.controls.forEach((ctrl, i) => { ctrl.patchValue({ main: i === index }); });
  }

  // --- VARIAÇÕES ---
  createVariationGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      quantityStock: [0, [Validators.required, Validators.min(0)]],
      sku: [''],
      imageUrl: ['']
    });
  }
  addVariation() { this.variationsArray.push(this.createVariationGroup()); }
  removeVariation(index: number) { this.variationsArray.removeAt(index); }

  // --- LÓGICA DE CATEGORIAS (REAL) ---

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.error('Erro ao carregar categorias', err)
    });
  }

  onCategoryChange(event: any) {
    const selectedValue = event.target.value;
    if (selectedValue === 'NEW') {
      this.isCreatingCategory = true;
      this.form.patchValue({ categoryId: null });
    }
  }

  cancelNewCategory() {
    this.isCreatingCategory = false;
    this.newCategoryName = '';
    this.form.patchValue({ categoryId: null });
  }

  saveNewCategory() {
    if (!this.newCategoryName.trim()) return;

    this.isSavingCategory = true;
    this.categoryService.create(this.newCategoryName).subscribe({
      next: (newCat) => {
        this.categories.push(newCat); // Adiciona na lista
        this.form.patchValue({ categoryId: newCat.id }); // Seleciona
        this.isCreatingCategory = false;
        this.newCategoryName = '';
        this.isSavingCategory = false;
        alert('Categoria criada!');
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao criar categoria.');
        this.isSavingCategory = false;
      }
    });
  }

  // --- CARREGAR PRODUTO (Edição) ---
  loadProduct(id: string) {
    // TODO: Implementar lógica de preencher FormArrays na edição
  }

  // --- SUBMIT ---
  onSubmit() {
    if (this.form.invalid) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    const productData = this.form.value;

    const payload = {
      ...productData,
      active: productData.active ?? true,
      category: { id: productData.categoryId }
    };
    delete payload.categoryId;

    console.log('Enviando:', payload);

    this.productService.createProduct(payload).subscribe({
      next: () => {
        alert('Produto cadastrado com sucesso!');
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao criar produto.');
      }
    });
  }
}
