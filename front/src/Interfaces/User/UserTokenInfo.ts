export default interface UserTokenInfo {
    email: string;
    username: string;
    roles: string[] |string | null;
    image: string;
    exp: number;
}