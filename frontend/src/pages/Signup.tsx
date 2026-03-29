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

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup: React.FC = () => {
  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      const user = await signup({ ...values, role: 'user' });
      toast({
        title: 'Account created!',
        description: 'You have successfully registered.',
      });
      navigate(user.role === 'admin' ? '/admin' : '/user');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Signup failed',
        description: error.response?.data?.message || 'Something went wrong',
      });
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    try {
      if (response.credential) {
        const user = await googleLogin(response.credential);
        toast({
          title: 'Welcome!',
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
          animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/4 w-80 h-80 rounded-full bg-accent/10 blur-3xl"
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
            <Link to="/login">
              <Button variant="ghost" className="text-primary font-bold">Login</Button>
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center w-full px-4 relative z-10 py-10">
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
                Join <span className="gradient-text">Teja</span>
              </CardTitle>
              <p className="text-muted-foreground mt-2">Start your AI development journey</p>
            </CardHeader>
            <CardContent className="px-8 pb-10">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Full Name"
                            className="bg-white/50 border-border/50 focus-visible:ring-primary py-6 text-lg rounded-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Email address"
                            className="bg-white/50 border-border/50 focus-visible:ring-primary py-6 text-lg rounded-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Password"
                            className="bg-white/50 border-border/50 focus-visible:ring-primary py-6 text-lg rounded-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={form.formState.isSubmitting}
                    className="w-full bg-primary hover:bg-accent text-white py-6 text-lg font-bold rounded-xl mt-4 shadow-lg transition-all active:scale-[0.98]"
                  >
                    {form.formState.isSubmitting ? 'Creating account...' : 'Sign up'}
                  </Button>
                </form>
              </Form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-transparent px-2 text-muted-foreground font-medium">Or join with</span>
                </div>
              </div>

              <div className="flex justify-center w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    toast({
                      variant: 'destructive',
                      title: 'Google Signup failed',
                      description: 'Something went wrong',
                    });
                  }}
                  useOneTap
                  theme="filled_blue"
                  shape="pill"
                  width="100%"
                />
              </div>

              <div className="mt-8 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-bold hover:underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Signup;
