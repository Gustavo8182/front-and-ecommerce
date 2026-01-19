import { Category } from '../../models/category.model';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product, ProductImage, ProductVariation } from '../../models/product.model'; // Import interfaces

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
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
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      brand: ['', Validators.required],
      categoryId: [null, Validators.required],

      // Dados Fiscais
      ncm: [''],
      cest: [''],
      cfopState: [''],
      cfopInterstate: [''],
      origin: ['0'],
      csosn: ['102'],
      unit: ['UN'],

      // Envio
      weightKg: [null],
      widthCm: [null],
      heightCm: [null],
      depthCm: [null],

      active: [true],
      images: this.fb.array([]),
      variations: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadCategories();

    this.productId = this.route.snapshot.paramMap.get('id');

    if (this.productId) {
      this.isEditMode = true;
      // FIX: Removed the empty loadProduct() call
      this.loadProductData(this.productId);
    } else {
      // Criação
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

createVariationGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      quantityStock: [0, [Validators.required, Validators.min(0)]],
      sku: [''],
      gtin: [''],
      imageUrl: ['']
    });
  }

  addVariation() { this.variationsArray.push(this.createVariationGroup()); }
  removeVariation(index: number) { this.variationsArray.removeAt(index); }

  // --- LÓGICA DE CATEGORIAS ---
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
        this.categories.push(newCat);
        this.form.patchValue({ categoryId: newCat.id });
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

  // --- SUBMIT ---
  onSubmit() {
    if (this.form.invalid) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    const formValue = this.form.value;

    const payload = {
      name: formValue.name,
      description: formValue.description,
      brand: formValue.brand,
      price: formValue.variations[0]?.price || 0,
      categoryId: formValue.categoryId,
      videoUrl: '',
      active: true,
      // Fiscal/Envio mapping... (Optional fields are handled automatically by formValue if names match DTO)
      ncm: formValue.ncm,
      origin: formValue.origin,
      csosn: formValue.csosn,
      unit: formValue.unit,
      weightKg: formValue.weightKg,
      widthCm: formValue.widthCm,
      heightCm: formValue.heightCm,
      depthCm: formValue.depthCm,

      images: formValue.images.map((img: any) => ({
          imageUrl: img.imageUrl,
          main: img.main
      })),


      variations: formValue.variations.map((v: any) => ({
          name: v.name,
          price: v.price,
          quantityStock: v.quantityStock,
          sku: v.sku,
          gtin: v.gtin || '',
          imageUrl: v.imageUrl
      }))

    };

    console.log('Enviando Payload:', payload);

    if (this.isEditMode && this.productId) {
        // UPDATE MODE
        this.productService.updateProduct(this.productId, payload).subscribe({
            next: () => {
                alert('Produto atualizado com sucesso! ✅');
                this.router.navigate(['/seller-center']);
            },
            error: (err) => {
                console.error(err);
                alert('Erro ao atualizar produto.');
            }
        });
    } else {
        // CREATE MODE
        this.productService.createProduct(payload).subscribe({
            next: () => {
                alert('Produto cadastrado com sucesso! 🚀');
                this.router.navigate(['/seller-center']);
            },
            error: (err) => {
                console.error(err);
                const msg = err.error ? (typeof err.error === 'string' ? err.error : err.error.message) : 'Erro desconhecido';
                alert('Erro ao criar produto: ' + msg);
            }
        });
    }
  }

  loadProductData(id: string) {
    this.productService.getProductById(id).subscribe({
      next: (product: Product) => { // Type assertion for better intelisense
        console.log('Produto carregado:', product);

        const firstPrice = product.variations && product.variations.length > 0
                           ? product.variations[0].price
                           : 0;

        // 1. Patch Value (Simple Fields)
        this.form.patchValue({
          name: product.name,
          description: product.description,
          brand: product.brand,
          categoryId: product.category?.id || product.category.id || null,
          price: firstPrice,

          ncm: product.ncm,
          origin: product.origin,
          csosn: product.csosn,
          unit: product.unit,

          weightKg: product.weightKg,
          widthCm: product.widthCm,
          heightCm: product.heightCm,
          depthCm: product.depthCm,

          active: product.active
        });

        // 2. Clear Arrays
        this.imagesArray.clear();
        this.variationsArray.clear();

        // 3. Rebuild Images
        if (product.images) {
          product.images.forEach((img: ProductImage) => {
            this.imagesArray.push(this.fb.group({
              imageUrl: [img.imageUrl, Validators.required],
              main: [img.main]
            }));
          });
        }

        // 4. Rebuild Variations
        if (product.variations) {
          product.variations.forEach((v: ProductVariation) => {
            this.variationsArray.push(this.fb.group({
              name: [v.name, Validators.required],
              price: [v.price, Validators.required],
              quantityStock: [v.quantityStock, Validators.required],
              sku: [v.sku],
              gtin: [v.gtin || ''],
              imageUrl: [v.imageUrl]
            }));
          });
        }
      },
      error: (err) => {
        console.error('Erro ao carregar produto', err);
        alert('Erro ao carregar dados do produto.');
      }
    });
  }
}
