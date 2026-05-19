export default interface IUserRegister {
    username: string;
    email: string,
    password: string,
    confirmPassword: string,
    image: File | null,
}