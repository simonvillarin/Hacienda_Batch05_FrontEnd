import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AddressService } from 'src/app/shared/services/address/address.service';
import { RegisterService } from 'src/app/shared/services/register/register.service';
import {
  PasswordLengthValidator,
  hasUppercaseValidator,
  hasLowercaseValidator,
  hasNumberValidator,
  hasSymbolValidator,
  mobileNumberValidator,
  birthdateValidator,
  confirmPasswordValidator,
  ageValidator,
} from 'src/app/shared/validators/custom.validator';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  genders = ['Male', 'Female', 'Others'];
  idTypes = [
    'e-Card / UMID',
    'Driver’s License',
    'Professional Regulation Commission (PRC) ID',
    'Senior Citizen ID',
    'SSS ID',
    'COMELEC / Voter’s ID / COMELEC Registration Form',
    'Philippine Identification (PhilID / ePhilID)',
    'NBI Clearance',
    'Philippine Postal ID',
    'Others',
  ];
  barangays: any = [];
  cities: any = [];
  provinces: any = [];
  regions: any = [];

  tempBarangays: any = [];
  tempCities: any = [];
  tempProvinces: any = [];
  tempRegions: any = [];

  file: any;
  idFront: string | ArrayBuffer | null = null;
  idBack: string | ArrayBuffer | null = null;
  uploadImage: string | ArrayBuffer | null = null;
  regionSelected: any;
  provinceSelected: any;
  citySelected: any;

  error = false;
  pass = false;
  confirmPass = false;

  alert = false;
  isError = false;
  currentPass = false;

  idFrontPreview = false;
  idBackPreview = false;
  idFrontEmpty = false;
  idBackEmpty = false;
  selfie = false;
  upload = false;
  hasChoosen = false;

  type: string = '';
  alertMessage: string = '';

  triggerObservable = new Subject<void>();
  webcamImage: any;

  ngOnInit(): void {
    this.getBarangay();
    this.getCity();
    this.getProvince();
    this.getRegion();
  }

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private registerService: RegisterService,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        middleName: [''],
        lastName: ['', Validators.required],
        suffix: [''],
        gender: ['', Validators.required],
        birthdate: [
          '',
          [Validators.required, birthdateValidator(), ageValidator()],
        ],
        unit: ['', Validators.required],
        street: ['', Validators.required],
        village: ['', Validators.required],
        barangay: ['', Validators.required],
        city: ['', Validators.required],
        province: ['', Validators.required],
        region: ['', Validators.required],
        contact: ['', [Validators.required, mobileNumberValidator()]],
        email: ['', [Validators.required, Validators.email]],
        idType: ['', Validators.required],
        idNumber: ['', Validators.required],
        filename1: ['', Validators.required],
        selfie: ['', Validators.required],
        mimeType1: ['', Validators.required],
        data1: ['', Validators.required],
        filename2: ['', Validators.required],
        mimeType2: ['', Validators.required],
        data2: ['', Validators.required],
        username: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            PasswordLengthValidator(),
            hasUppercaseValidator(),
            hasLowercaseValidator(),
            hasNumberValidator(),
            hasSymbolValidator(),
          ],
        ],
        confirmPassword: [
          '',
          [Validators.required, confirmPasswordValidator()],
        ],
        role: ['', Validators.required],
        status: ['Pending'],
      },
      { validators: confirmPasswordValidator() }
    );
  }

  get firstName() {
    return this.registerForm.get('firstName') as FormControl;
  }

  get middleName() {
    return this.registerForm.get('middleName') as FormControl;
  }

  get lastName() {
    return this.registerForm.get('lastName') as FormControl;
  }

  get suffix() {
    return this.registerForm.get('suffix') as FormControl;
  }

  get gender() {
    return this.registerForm.get('gender') as FormControl;
  }

  get birthdate() {
    return this.registerForm.get('birthdate') as FormControl;
  }

  get unit() {
    return this.registerForm.get('unit') as FormControl;
  }

  get street() {
    return this.registerForm.get('street') as FormControl;
  }

  get village() {
    return this.registerForm.get('village') as FormControl;
  }

  get barangay() {
    return this.registerForm.get('barangay') as FormControl;
  }

  get city() {
    return this.registerForm.get('city') as FormControl;
  }

  get province() {
    return this.registerForm.get('province') as FormControl;
  }

  get region() {
    return this.registerForm.get('region') as FormControl;
  }

  get contact() {
    return this.registerForm.get('contact') as FormControl;
  }

  get email() {
    return this.registerForm.get('email') as FormControl;
  }

  get idType() {
    return this.registerForm.get('idType') as FormControl;
  }

  get idNumber() {
    return this.registerForm.get('idNumber') as FormControl;
  }

  get filename1() {
    return this.registerForm.get('filename1') as FormControl;
  }

  get filename2() {
    return this.registerForm.get('filename2') as FormControl;
  }

  get selfieImg() {
    return this.registerForm.get('selfie') as FormControl;
  }

  get username() {
    return this.registerForm.get('username') as FormControl;
  }

  get password() {
    return this.registerForm.get('password') as FormControl;
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword') as FormControl;
  }

  get role() {
    return this.registerForm.get('role') as FormControl;
  }

  getBarangay = () => {
    this.addressService.getBarangay().subscribe((data: any) => {
      data.map((arr: any) => {
        this.tempBarangays.push(arr);
      });
    });
  };

  getCity = () => {
    this.addressService.getCity().subscribe((data: any) => {
      data.map((arr: any) => {
        this.tempCities.push(arr);
      });
    });
  };

  getProvince = () => {
    this.addressService.getProvince().subscribe((data: any) => {
      data.map((arr: any) => {
        this.tempProvinces.push(arr);
      });
    });
  };

  getRegion = () => {
    this.addressService.getRegion().subscribe((data: any) => {
      data.map((region: any) => {
        this.regions.push(region);
      });
    });
  };

  togglePassword = () => {
    this.pass = !this.pass;
  };

  toggleConfirmPassword = () => {
    this.confirmPass = !this.confirmPass;
  };

  onRegionChange = (region: any) => {
    if (region != '') {
      this.barangays = [];
      this.cities = [];
      this.provinces = [];
      this.provinces = this.tempProvinces.filter(
        (province: any) => province.region_code === region.id
      );
    }
  };

  onProvinceChange = (province: any) => {
    if (province != '') {
      this.cities = this.tempCities.filter(
        (city: any) => city.province_code == province.id
      );
    }
  };

  onCityChange = (city: any) => {
    if (city != '') {
      this.barangays = this.tempBarangays.filter(
        (barangay: any) => barangay.city_code == city.id
      );
    }
  };

  onRoleChange = (role: string) => {
    if (role != '') {
      this.error = false;
      this.registerForm.patchValue({
        role: role,
      });
    }
  };

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    const reader = new FileReader();
    this.idFrontPreview = true;
    this.idFrontEmpty = false;
    console.log(this.idFrontPreview);

    reader.onload = (e: any) => {
      this.idFront = e.target.result;
    };

    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      this.readFileAsBytes(file);
    }

    reader.readAsDataURL(this.file);
  }

  readFileAsBytes(file: File) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result;
      if (result instanceof ArrayBuffer) {
        const bytes = new Uint8Array(result);
        const mimeType = file.type;
        const fileName = file.name;

        this.registerForm.patchValue({
          filename1: fileName,
          mimeType1: mimeType,
          data1: Array.from(bytes),
        });
      }
    };

    reader.readAsArrayBuffer(file);
  }

  onFileSelected1(event: any) {
    this.file = event.target.files[0];
    const reader = new FileReader();
    this.idBackPreview = true;
    this.idBackEmpty = false;
    console.log(this.idBackPreview);

    reader.onload = (e: any) => {
      this.idBack = e.target.result;
    };

    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      this.readFileAsBytes1(file);
    }

    reader.readAsDataURL(this.file);
  }

  readFileAsBytes1(file: File) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result;
      if (result instanceof ArrayBuffer) {
        const bytes = new Uint8Array(result);
        const mimeType = file.type;
        const fileName = file.name;

        this.registerForm.patchValue({
          filename2: fileName,
          mimeType2: mimeType,
          data2: Array.from(bytes),
        });
      }
    };

    reader.readAsArrayBuffer(file);
  }

  onFileSelected2(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.uploadImage = reader.result;
        this.registerForm.patchValue({
          selfie: reader.result,
        });
        this.upload = true;
        this.hasChoosen = true;
      };

      reader.readAsDataURL(file);
    }
  }

  onSubmit = () => {
    if (this.type === '') {
      this.error = true;
      scroll(0, 0);
    }
    if (this.idFront === null) {
      this.idFrontPreview = false;
      this.idFrontEmpty = true;
    }
    if (this.idBack === null) {
      this.idBackEmpty = true;
      this.idBackPreview = false;
    }

    if (this.registerForm.valid) {
      this.registerForm.patchValue({
        region: this.registerForm.get('region')?.value.name,
        province: this.registerForm.get('province')?.value.name,
        city: this.registerForm.get('city')?.value.name,
        barangay: this.registerForm.get('barangay')?.value.name,
      });

      this.registerService
        .registerUser(this.registerForm.value)
        .subscribe((response) => {
          if (response.message === 'Contact number already exists') {
            this.alert = true;
            this.isError = true;
            this.alertMessage = 'Contact number already exists';
            setTimeout(() => (this.alert = false), 3000);
            scroll(0, 0);
          } else if (response.message === 'Email already exists') {
            this.alert = true;
            this.isError = true;
            this.alertMessage = 'Email address already exists';
            setTimeout(() => (this.alert = false), 3000);
            scroll(0, 0);
          } else if (response.message === 'Username already exists') {
            this.alert = true;
            this.isError = true;
            this.alertMessage = 'Username already exists';
            setTimeout(() => (this.alert = false), 3000);
            scroll(0, 0);
          } else {
            this.idFrontPreview = false;
            this.idBackPreview = false;
            this.alert = true;
            this.isError = false;
            this.alertMessage =
              'Registered successful! Please wait for the email or text message upon the activation of your account';
            setTimeout(() => (this.alert = false), 5000);
            scroll(0, 0);

            const radioButtons =
              this.elementRef.nativeElement.querySelectorAll('.radio1');
            radioButtons.forEach((radio: any) => {
              this.renderer.setProperty(radio, 'checked', false);
            });
            this.type = '';
            this.hasChoosen = false;
            this.uploadImage = null;
            this.registerForm.reset();
          }
        });
    } else {
      this.registerForm.markAllAsTouched();
    }
  };

  handleImageCapture(image: WebcamImage) {
    this.selfie = true;
    this.webcamImage = image;

    this.registerForm.patchValue({
      selfie: image.imageAsDataUrl,
    });
  }

  handleInitError(error: WebcamInitError) {
    console.error('Webcam initialization error:', error);
  }

  captureSelfie() {
    this.triggerObservable.next();
  }

  another = () => {
    this.selfie = false;
  };

  onSelfie = () => {
    this.upload = false;
    this.hasChoosen = true;
  };

  onUpload = () => {
    this.upload = true;
    this.hasChoosen = true;
  };

  onCancel = () => {
    this.hasChoosen = false;
  };

  extractMimeType(dataUrl: string): string {
    return dataUrl.split(':')[1].split(';')[0];
  }

  generateUniqueFilename() {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 15);
    return `${timestamp}_${randomString}.png`;
  }
}
