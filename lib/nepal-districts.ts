export interface District {
  name: string;
  province: string;
}

export const NEPAL_DISTRICTS: District[] = [
  // Province 1 (Koshi)
  { name: 'Taplejung', province: 'Koshi Province' },
  { name: 'Panchthar', province: 'Koshi Province' },
  { name: 'Ilam', province: 'Koshi Province' },
  { name: 'Jhapa', province: 'Koshi Province' },
  { name: 'Morang', province: 'Koshi Province' },
  { name: 'Sunsari', province: 'Koshi Province' },
  { name: 'Dhankuta', province: 'Koshi Province' },
  { name: 'Terhathum', province: 'Koshi Province' },
  { name: 'Sankhuwasabha', province: 'Koshi Province' },
  { name: 'Bhojpur', province: 'Koshi Province' },
  { name: 'Solukhumbu', province: 'Koshi Province' },
  { name: 'Okhaldhunga', province: 'Koshi Province' },
  { name: 'Khotang', province: 'Koshi Province' },
  { name: 'Udayapur', province: 'Koshi Province' },
  // Province 2 (Madhesh)
  { name: 'Saptari', province: 'Madhesh Province' },
  { name: 'Siraha', province: 'Madhesh Province' },
  { name: 'Dhanusha', province: 'Madhesh Province' },
  { name: 'Mahottari', province: 'Madhesh Province' },
  { name: 'Sarlahi', province: 'Madhesh Province' },
  { name: 'Rautahat', province: 'Madhesh Province' },
  { name: 'Bara', province: 'Madhesh Province' },
  { name: 'Parsa', province: 'Madhesh Province' },
  // Bagmati Province
  { name: 'Sindhuli', province: 'Bagmati Province' },
  { name: 'Ramechhap', province: 'Bagmati Province' },
  { name: 'Dolakha', province: 'Bagmati Province' },
  { name: 'Sindhupalchok', province: 'Bagmati Province' },
  { name: 'Kavrepalanchok', province: 'Bagmati Province' },
  { name: 'Lalitpur', province: 'Bagmati Province' },
  { name: 'Bhaktapur', province: 'Bagmati Province' },
  { name: 'Kathmandu', province: 'Bagmati Province' },
  { name: 'Nuwakot', province: 'Bagmati Province' },
  { name: 'Rasuwa', province: 'Bagmati Province' },
  { name: 'Dhading', province: 'Bagmati Province' },
  { name: 'Makwanpur', province: 'Bagmati Province' },
  { name: 'Chitwan', province: 'Bagmati Province' },
  // Gandaki Province
  { name: 'Gorkha', province: 'Gandaki Province' },
  { name: 'Manang', province: 'Gandaki Province' },
  { name: 'Mustang', province: 'Gandaki Province' },
  { name: 'Myagdi', province: 'Gandaki Province' },
  { name: 'Kaski', province: 'Gandaki Province' },
  { name: 'Lamjung', province: 'Gandaki Province' },
  { name: 'Tanahu', province: 'Gandaki Province' },
  { name: 'Nawalpur', province: 'Gandaki Province' },
  { name: 'Syangja', province: 'Gandaki Province' },
  { name: 'Parbat', province: 'Gandaki Province' },
  { name: 'Baglung', province: 'Gandaki Province' },
  // Lumbini Province
  { name: 'Gulmi', province: 'Lumbini Province' },
  { name: 'Palpa', province: 'Lumbini Province' },
  { name: 'Nawalparasi East', province: 'Lumbini Province' },
  { name: 'Rupandehi', province: 'Lumbini Province' },
  { name: 'Kapilvastu', province: 'Lumbini Province' },
  { name: 'Arghakhanchi', province: 'Lumbini Province' },
  { name: 'Pyuthan', province: 'Lumbini Province' },
  { name: 'Rolpa', province: 'Lumbini Province' },
  { name: 'Eastern Rukum', province: 'Lumbini Province' },
  { name: 'Dang', province: 'Lumbini Province' },
  { name: 'Banke', province: 'Lumbini Province' },
  { name: 'Bardiya', province: 'Lumbini Province' },
  // Karnali Province
  { name: 'Dolpa', province: 'Karnali Province' },
  { name: 'Mugu', province: 'Karnali Province' },
  { name: 'Humla', province: 'Karnali Province' },
  { name: 'Jumla', province: 'Karnali Province' },
  { name: 'Kalikot', province: 'Karnali Province' },
  { name: 'Dailekh', province: 'Karnali Province' },
  { name: 'Jajarkot', province: 'Karnali Province' },
  { name: 'Western Rukum', province: 'Karnali Province' },
  { name: 'Salyan', province: 'Karnali Province' },
  { name: 'Surkhet', province: 'Karnali Province' },
  // Sudurpashchim Province
  { name: 'Bajura', province: 'Sudurpashchim Province' },
  { name: 'Bajhang', province: 'Sudurpashchim Province' },
  { name: 'Achham', province: 'Sudurpashchim Province' },
  { name: 'Doti', province: 'Sudurpashchim Province' },
  { name: 'Kailali', province: 'Sudurpashchim Province' },
  { name: 'Kanchanpur', province: 'Sudurpashchim Province' },
  { name: 'Dadeldhura', province: 'Sudurpashchim Province' },
  { name: 'Baitadi', province: 'Sudurpashchim Province' },
  { name: 'Darchula', province: 'Sudurpashchim Province' },
];

export const NEPAL_PROVINCES = [
  'Koshi Province',
  'Madhesh Province',
  'Bagmati Province',
  'Gandaki Province',
  'Lumbini Province',
  'Karnali Province',
  'Sudurpashchim Province',
];

export function getDistrictsByProvince(province: string): District[] {
  return NEPAL_DISTRICTS.filter((d) => d.province === province);
}

export function getProvinceForDistrict(districtName: string): string {
  return NEPAL_DISTRICTS.find((d) => d.name === districtName)?.province ?? '';
}
