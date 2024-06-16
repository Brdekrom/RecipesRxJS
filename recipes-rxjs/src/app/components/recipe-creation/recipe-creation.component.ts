import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-recipe-creation',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatChipsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './recipe-creation.component.html',
  styleUrls: ['./recipe-creation.component.css']
})
export class RecipeCreationComponent implements OnInit {
  form!: FormGroup;
  showHelperText = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

  constructor(private formBuilder: FormBuilder, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(60)]],
      description: ['', [Validators.required, this.wordCountValidator(25)]],
      image: [null, Validators.required],
      difficulty: [null, Validators.required],
      tags: this.formBuilder.array([this.formBuilder.control(null, Validators.required)])
    });
  }

  get tagsArray() {
    return this.form.get('tags') as FormArray;
  }

  addTag(tag: string) {
    if (tag) {
      this.tagsArray.push(this.formBuilder.control(tag, Validators.required));
      this.cd.detectChanges();
      this.showHelperText = false;
    }
  }

  addTagFromInput(event: MatChipInputEvent): void {
    const input = event.chipInput.inputElement;
    const value = event.value;
    if ((value || '').trim()) {
      this.addTag(value.trim());
    }
    if (input) {
      input.value = '';
    }
  }

  removeTag(index: number) {
    this.tagsArray.removeAt(index);
    this.cd.detectChanges();
  }

  removeImage() {
    this.form.patchValue({ image: null });
    this.form.get('image')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }

  onTagInputChange() {
    this.showHelperText = this.tagInput.nativeElement.value.length > 0;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.form.patchValue({
        image: file.name
      });
      this.form.get('image')?.updateValueAndValidity();
    }
  }

  wordCountValidator(maxWords: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const words = control.value ? control.value.split(/\s+/) : [];
      return words.length > maxWords ? { maxWords: { actualWords: words.length, maxWords } } : null;
    };
  }
}
