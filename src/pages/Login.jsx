import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogIn, UserX, UserPlus, Info, Database, HelpCircle, CheckCircle2 } from 'lucide-react';

export const Login = () => {
  const { loginUser, registerUser, loginGuest, isLoggedIn, dbStatus } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loginSpinnerMessage, setLoginSpinnerMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStatusExplain, setShowStatusExplain] = useState(false);

  // Get redirection path or fall back to / (home)
  const redirectPath = location.state?.from?.pathname || '/';

  // If already logged in, navigate away
  useEffect(() => {
    if (isLoggedIn) {
      navigate(redirectPath, { replace: true });
    }
  }, [isLoggedIn, navigate, redirectPath]);

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    if (isSignup) {
      if (!name.trim()) {
        setValidationError('Please enter your full name.');
        setIsSubmitting(false);
        return;
      }
      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters long.');
        setIsSubmitting(false);
        return;
      }
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match.');
        setIsSubmitting(false);
        return;
      }

      try {
        // FE DEV NOTE: Triggering the backend register API route
        await registerUser(name, email, password);
        
        // Show clean success message instead of auto-logging in!
        setSuccessMessage('Account created successfully. Please login.');
        setIsSignup(false); // Shift the UI tab/view to log in mode
        setPassword('');
        setConfirmPassword('');
        // Keep their email pre-filled for convenience!
      } catch (err) {
        setValidationError(err.message || 'An error occurred during registration.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      try {
        // FE DEV NOTE: Simulated tactical delay for a fluid, natural loading state
        setLoginSpinnerMessage('Logging you in...');
        await new Promise(resolve => setTimeout(resolve, 800)); // few hundred milliseconds (800ms)
        
        await loginUser(email, password);
        // Clean session validated, navigate replaces route automatically through the global isLoggedIn useEffect
      } catch (err) {
        setValidationError(err.message || 'Invalid email or password.');
      } finally {
        setLoginSpinnerMessage('');
        setIsSubmitting(false);
      }
    }
  };

  const handleGuestLogin = async () => {
    setValidationError('');
    setSuccessMessage('');
    setIsSubmitting(true);
    setLoginSpinnerMessage('Authenticating as guest...');
    
    // Quick simulated delay
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      loginGuest();
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setValidationError('Guest login bypass error.');
    } finally {
      setLoginSpinnerMessage('');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50/50 min-h-screen pt-24 pb-32 flex flex-col justify-center items-center px-4">
      <div className="relative w-full max-w-[420px] font-sans">
        {/* Authentication Card Container */}
        <section className="bg-white border border-slate-150/50 rounded-2xl shadow-xl shadow-slate-100 p-8 md:p-10">
          
          <div className="flex flex-col items-center text-center mb-6 select-none">
            <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center mb-4 text-[#D4FC79] shadow-sm">
              {isSignup ? <UserPlus className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
              {isSignup ? 'Create your Account' : 'Sign in to ShopZone'}
            </h1>
            <p className="text-xs text-slate-400 font-medium mb-1">
              {isSignup 
                ? 'Join ShopZone to manage your cart, orders, and details.' 
                : 'Enter your credentials to manage your transactions.'}
            </p>

            {/* Educational SQL Core Instance Diagnostics */}
            <div className="w-full mt-2 self-stretch">
              <div 
                onClick={() => setShowStatusExplain(!showStatusExplain)}
                className={`py-1.5 px-3 rounded-full flex items-center justify-center gap-1.5 cursor-pointer text-[10px] font-bold tracking-wide transition-all select-none border ${
                  dbStatus.dbMode === 'postgres'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-100 hover:bg-emerald-100/60'
                    : 'bg-amber-50 text-amber-800 border-amber-100 hover:bg-amber-100/60'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>
                  {dbStatus.dbMode === 'postgres' 
                    ? `PostgreSQL: Active` 
                    : 'Backend Fallback Database'}
                </span>
                <HelpCircle className="w-3.5 h-3.5 opacity-60 ml-0.5" />
              </div>

              {showStatusExplain && (
                <div className="mt-2 text-[10px] text-left leading-relaxed bg-slate-50 border border-slate-100 p-3 rounded-xl text-slate-500 font-medium transition-all">
                  <p className="font-bold text-slate-700 mb-1">Full-Stack Auth Architecture Overview:</p>
                  <p className="mb-1">
                    <strong>• Hosting:</strong> Fast Cloud Run node container hosting (or serverless Lambdas on Vercel) serving our Express route targets.
                  </p>
                  <p className="mb-1">
                    <strong>• Instance:</strong> The external database engine (e.g. Neon, Supabase, Google Cloud SQL, AWS RDS) listening for connections.
                  </p>
                  <p>
                    <strong>• Setup:</strong> Input your PostgreSQL credentials as standard <code>DATABASE_URL</code> and <code>JWT_SECRET</code> in the Secrets Settings map to activate secure production storage!
                  </p>
                </div>
              )}
            </div>
          </div>

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs font-semibold flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {loginSpinnerMessage && (
            <div className="mb-4 p-3 bg-slate-900 text-[#D4FC79] border border-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-3 animate-pulse select-none">
              <div className="w-3.5 h-3.5 border-2 border-[#D4FC79] border-t-transparent rounded-full animate-spin"></div>
              <span className="font-mono tracking-wider text-[11px] uppercase text-white">{loginSpinnerMessage}</span>
            </div>
          )}

          {validationError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{validationError}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleCredentialsSubmit}>
            {isSignup && (
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block block">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full h-11 px-4 font-medium text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-100 transition-all placeholder:text-slate-350 disabled:bg-slate-50 disabled:text-slate-450"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block block">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                disabled={isSubmitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full h-11 px-4 font-medium text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-100 transition-all placeholder:text-slate-350 disabled:bg-slate-50 disabled:text-slate-450"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center mb-0.5">
                <label htmlFor="password" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block block">
                  Password
                </label>
                {!isSignup && (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleGuestLogin}
                    className="text-[10px] font-bold text-slate-950 hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <input
                id="password"
                type="password"
                required
                disabled={isSubmitting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-4 font-medium text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-100 transition-all placeholder:text-slate-350 disabled:bg-slate-50 disabled:text-slate-450"
              />
            </div>

            {isSignup && (
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block block">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  disabled={isSubmitting}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-4 font-medium text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-100 transition-all placeholder:text-slate-350 disabled:bg-slate-50 disabled:text-slate-450"
                />
              </div>
            )}

            <div className="space-y-4 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-slate-950 text-[#D4FC79] font-bold text-xs rounded-xl hover:bg-slate-900 transition-all shadow-sm flex items-center justify-center gap-2 outline-none cursor-pointer disabled:bg-slate-800 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : isSignup ? (
                  <UserPlus className="w-4 h-4" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                {isSubmitting ? 'Processing...' : isSignup ? 'Complete Registration' : 'Sign In'}
              </button>
              
              <div className="relative flex items-center py-2 select-none">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="mx-4 flex-shrink text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  or
                </span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              {/* Guest Login Primary Button */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleGuestLogin}
                className="w-full h-11 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 outline-none cursor-pointer"
              >
                <UserX className="w-4 h-4 text-slate-500" /> Continue as Guest
              </button>
            </div>
          </form>

          <footer className="mt-8 text-center text-xs text-slate-400 font-medium select-none">
            {isSignup ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(false);
                    setValidationError('');
                  }}
                  className="text-slate-950 font-bold hover:underline"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(true);
                    setValidationError('');
                  }}
                  className="text-slate-950 font-bold hover:underline"
                >
                  Sign up for free
                </button>
              </>
            )}
          </footer>
        </section>

        {/* Footer info links */}
        <div className="mt-8 flex justify-center gap-6 text-xs text-slate-400/80 font-medium select-none">
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-600">Privacy</a>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-600">Support</a>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-600">Terms</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
