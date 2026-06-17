'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { upload } from '@vercel/blob/client';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'DISCORD_BOT',
    budget: '',
    timeline: '',
    description: '',
    brandAssets: '',
    socialHandles: '',
    targetReferences: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    
    try {
      const urls: string[] = [];
      for (const file of Array.from(e.target.files)) {
        const newBlob = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/blob-upload',
          multipart: true,
        });
        urls.push(newBlob.url);
      }
      
      const currentImages = formData.brandAssets ? formData.brandAssets.split(',').map(s => s.trim()).filter(Boolean) : [];
      const newImagesString = [...currentImages, ...urls].join(', ');
      
      setFormData({ ...formData, brandAssets: newImagesString });
      
      e.target.value = '';
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        brandAssets: formData.brandAssets ? formData.brandAssets.split(',').map(s => s.trim()) : [],
        socialHandles: formData.socialHandles ? formData.socialHandles.split(',').map(s => s.trim()) : [],
      };

      const res = await fetch('/api/projects/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (!res.ok) throw new Error('Failed to submit onboarding form');
      
      await res.json();
      router.push('/dashboard/projects?onboarded=true');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('There was an error submitting your project details. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-3xl">
      <div className="mb-xl text-center">
        <h1 className="text-3xl font-heading text-primary mb-xs">Project Onboarding</h1>
        <p className="text-secondary text-sm">Let's get some basic details down before our consultation.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-xl relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-subtle -z-10 rounded-full"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-accent -z-10 transition-all duration-300 rounded-full" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
        
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
            step >= i ? "bg-accent text-inverse" : "bg-card border-2 border-subtle text-secondary"
          )}>
            {i}
          </div>
        ))}
      </div>

      <div className="bg-card border border-subtle rounded-xl p-xl shadow-lg">
        <form onSubmit={handleSubmit}>
          
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-heading text-primary mb-md">Step 1: The Basics</h2>
              <div className="space-y-md">
                <div>
                  <label className="block text-sm text-secondary mb-xs">Project Name</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Nexus RPG Bot"
                    className="w-full bg-primary border border-subtle rounded-md px-md py-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-secondary mb-xs">Project Type</label>
                  <select
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full bg-primary border border-subtle rounded-md px-md py-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  >
                    <option value="DISCORD_BOT">Discord Bot</option>
                    <option value="TELEGRAM_BOT">Telegram Bot</option>
                    <option value="WEBSITE">Website / Web App</option>
                    <option value="API">API Development</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Scope & Budget */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-heading text-primary mb-md">Step 2: Scope & Budget</h2>
              <div className="space-y-md">
                <div>
                  <label className="block text-sm text-secondary mb-xs">Estimated Budget (USD)</label>
                  <select
                    name="budget"
                    required
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full bg-primary border border-subtle rounded-md px-md py-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  >
                    <option value="">Select a range...</option>
                    <option value="<$500">Less than $500</option>
                    <option value="$500 - $1,000">$500 - $1,000</option>
                    <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                    <option value="$3,000+">$3,000+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-secondary mb-xs">Desired Timeline</label>
                  <select
                    name="timeline"
                    required
                    value={formData.timeline}
                    onChange={handleChange}
                    className="w-full bg-primary border border-subtle rounded-md px-md py-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  >
                    <option value="">Select a timeline...</option>
                    <option value="ASAP">As soon as possible</option>
                    <option value="1-2 Weeks">1-2 Weeks</option>
                    <option value="1 Month">1 Month</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Brand Assets */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-heading text-primary mb-md">Step 3: Brand Assets</h2>
              <div className="space-y-md">
                <div className="p-md bg-tertiary border border-subtle rounded-md">
                  <label className="block text-sm text-secondary mb-xs">Upload Logos or Moodboards</label>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    disabled={uploading}
                    className="w-full text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-subtle file:text-primary hover:file:bg-primary hover:file:text-inverse"
                  />
                  {uploading && <p className="text-sm text-primary mt-sm animate-pulse">Uploading files...</p>}
                </div>
                
                {formData.brandAssets && (
                  <div>
                    <label className="block text-sm text-secondary mb-xs">Uploaded Asset URLs (comma separated)</label>
                    <input
                      type="text"
                      name="brandAssets"
                      value={formData.brandAssets}
                      onChange={handleChange}
                      className="w-full bg-primary border border-subtle rounded-md px-md py-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Vision & Socials */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-heading text-primary mb-md">Step 4: Vision & Socials</h2>
              <div className="space-y-md">
                <div>
                  <label className="block text-sm text-secondary mb-xs">Project Vision & Features</label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell us what you want to build, specific features you need..."
                    className="w-full bg-primary border border-subtle rounded-md px-md py-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none resize-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm text-secondary mb-xs">Target References (Sites/Bots you like)</label>
                  <input
                    type="text"
                    name="targetReferences"
                    value={formData.targetReferences}
                    onChange={handleChange}
                    placeholder="e.g. Midjourney Bot, specific websites..."
                    className="w-full bg-primary border border-subtle rounded-md px-md py-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-secondary mb-xs">Your Social Handles (comma separated)</label>
                  <input
                    type="text"
                    name="socialHandles"
                    value={formData.socialHandles}
                    onChange={handleChange}
                    placeholder="e.g. @twitter, @instagram"
                    className="w-full bg-primary border border-subtle rounded-md px-md py-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-xl pt-lg border-t border-subtle flex justify-between">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="btn btn-outline" disabled={uploading || loading}>
                Back
              </button>
            ) : <div></div>}

            {step < 4 ? (
              <button type="button" onClick={nextStep} className="btn btn-primary" disabled={!formData.title || uploading}>
                Next Step
              </button>
            ) : (
              <button type="submit" disabled={loading || uploading} className="btn btn-primary">
                {loading ? 'Submitting...' : 'Submit Project Brief'}
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
