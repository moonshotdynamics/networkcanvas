type UserRole = 'admin' | 'user' | 'participant';

type Status = 'loading' | 'authenticated' | 'unauthenticated';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
