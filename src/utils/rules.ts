import { isArray, isEmail, isNotEmpty, isNumber, max, maxLength, min, minLength } from 'class-validator';

const rules = {
  email: (value: unknown): boolean | string => {
    return isEmail(value) || 'Mohon masukkan email valid';
  },
  required: (value: unknown): boolean | string => {
    return isNotEmpty(value) || 'Mohon diisi';
  },
  number: (value: unknown): boolean | string => {
    return isNumber(Number(value)) || 'Mohon masukkan angka'
  },
  phone: (value: unknown): boolean | string => {
    const regex = /628[0-9]+/gm
    return regex.test(typeof value === 'string' ? value : '') || 'Mohon isi nomor Hp dengan awalan 628'
  },
  minLength: (value: unknown, minValue?: number): boolean | string => {
    return minLength(value, minValue || 0) || `Mohon masukkan minimal ${minValue} karakter`
  },
  maxLength: (value: unknown, minValue?: number): boolean | string => {
    return maxLength(value, minValue || 0) || `Mohon masukkan maksimal ${minValue} karakter`
  },
  min: (value: unknown, minValue?: number): boolean | string => {
    return min(value, minValue || 0) || `Mohon masukkan angka minimal ${minValue}`
  },
  max: (value: unknown, maxValue?: number): boolean | string => {
    return max(value, maxValue || 0) || `Mohon masukkan angka maksimal ${maxValue}`
  },
  photo: (value: unknown): boolean | string => {
    return !!value &&
      isArray(value) &&
      (value as []).length > 0 ||
      "Mohon pilih unggah foto"
  }
}

export default rules
