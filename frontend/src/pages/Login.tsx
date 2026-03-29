import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import tejaLogo from '@/assets/teja-logo.png';
import ParticleField from '@/components/ParticleField';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const user = await login(values.email, values.password);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      navigate(user.role === 'admin' ? '/admin' : '/user');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: error.response?.data?.message || 'Invalid email or password',
      });
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    try {
      if (response.credential) {
        const user = await googleLogin(response.credential);
        toast({
          title: 'Welcome back!',
          description: 'Logged in successfully with Google.',
        });
        navigate(user.role === 'admin' ? '/admin' : '/user');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Login failed',
        description: error.response?.data?.message || 'Authentication failed',
      });
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center overflow-hidden pt-20">
      <ParticleField />
      
      {/* Background Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-3xl"
        />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 glass"
      >
        <div className="container mx-auto px-8 py-2 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src={tejaLogo} alt="Teja" className="h-12 w-auto" />
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/signup">
              <Button variant="hero" size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center w-full px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <img src={tejaLogo} alt="Teja" className="h-24 w-auto mb-4 drop-shadow-2xl" />
          <Card className="w-full max-w-md shadow-2xl border-none rounded-3xl glass backdrop-blur-xl">
            <CardHeader className="pt-10 pb-6 text-center">
              <CardTitle className="text-3xl font-extrabold tracking-tight text-foreground">
                Welcome <span className="gradient-text">Back</span>
              </CardTitle>
              <p className="text-muted-foreground mt-2">Sign in to manage your AI tasks</p>
            </CardHeader>
            <CardContent className="px-8 pb-10">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="Email address"
                    className="bg-white/50 border-border/50 focus-visible:ring-primary py-6 text-lg rounded-xl"
                  />
                  {errors.email && <p className="text-destructive text-sm font-medium">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Input
                    {...register('password')}
                    type="password"
                    placeholder="Password"
                    className="bg-white/50 border-border/50 focus-visible:ring-primary py-6 text-lg rounded-xl"
                  />
                  {errors.password && <p className="text-destructive text-sm font-medium">{errors.password.message}</p>}
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-accent text-white py-6 text-lg font-bold rounded-xl mt-4 shadow-lg transition-all active:scale-[0.98]"
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-transparent px-2 text-muted-foreground font-medium">Or continue with</span>
                </div>
              </div>

              <div className="flex justify-center w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    toast({
                      variant: 'destructive',
                      title: 'Google Login failed',
                      description: 'Something went wrong',
                    });
                  }}
                  useOneTap
                  theme="filled_blue"
                  shape="pill"
                  width="380"
                />
              </div>

              <div className="mt-8 text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary font-bold hover:underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;
