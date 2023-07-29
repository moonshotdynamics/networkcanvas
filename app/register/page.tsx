import { RegisterForm } from '@/components/Forms/RegisterForm';

export default function RegisterPage() {
  return (
    <section className="min-h-screen pt-20 bg-purple-500 bg-ct-blue-600">
      <div className="container flex items-center justify-center h-full px-6 py-12 mx-auto">
        <div className="px-8 py-10 bg-white rounded-md md:w-8/12 lg:w-5/12">
          <RegisterForm />
        </div>
      </div>
    </section>
  );
}
