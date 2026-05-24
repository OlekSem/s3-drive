export default interface IRegisterModel {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    image:  File | null;
}