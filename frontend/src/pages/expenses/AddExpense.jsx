import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { expenseService } from '../../services/expenseService';
import { CATEGORIES } from '../../constants/categories';
import { UploadCloud, X, ArrowLeft, DollarSign, Type, Calendar } from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const AddExpense = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: CATEGORIES[0].value,
    transactionDate: new Date().toISOString().split('T')[0],
  });
  const [receipt, setReceipt] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setReceipt(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const clearFile = () => {
    setReceipt(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dataToSubmit = { ...formData, amount: Number(formData.amount) };
      if (receipt) {
        dataToSubmit.receipt = receipt;
      }

      const res = await expenseService.createExpense(dataToSubmit);
      if (res && res.success) {
        navigate('/expenses');
      } else {
        setError(res?.message || 'Failed to add expense');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/expenses" className="p-2 text-text-secondary hover:text-text-primary hover:bg-slate-200 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Add New Expense</h1>
          <p className="text-text-secondary mt-1 text-sm">Record a new transaction</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm font-medium animate-fade-in">
          {error}
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Expense Title"
                id="title"
                name="title"
                type="text"
                required
                placeholder="e.g., Groceries, Flight Ticket"
                icon={Type}
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <Input
                label="Amount ($)"
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                icon={DollarSign}
                value={formData.amount}
                onChange={handleChange}
              />
            </div>

            <div>
              <Input
                label="Date"
                id="transactionDate"
                name="transactionDate"
                type="date"
                required
                icon={Calendar}
                value={formData.transactionDate}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-text-secondary mb-1.5" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                name="category"
                required
                className="w-full bg-white border border-border-color rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-accent/20 focus:border-primary-accent transition-all duration-200"
                value={formData.category}
                onChange={handleChange}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Receipt Image (Optional)
              </label>
              
              {!previewUrl ? (
                <div 
                  className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-border-color border-dashed rounded-xl hover:border-primary-accent hover:bg-slate-50 transition-colors cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="h-10 w-10 text-slate-400 group-hover:text-primary-accent transition-colors mb-3" />
                  <div className="flex text-sm text-text-secondary justify-center">
                    <span className="relative cursor-pointer rounded-md font-medium text-primary-accent hover:text-emerald-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-accent">
                      <span>Upload a file</span>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        ref={fileInputRef}
                        className="sr-only" 
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              ) : (
                <div className="mt-2 relative rounded-xl overflow-hidden border border-border-color inline-block group">
                  <img src={previewUrl} alt="Receipt preview" className="h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={clearFile}
                      className="p-2 bg-danger hover:bg-red-600 text-white rounded-full transition-colors shadow-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-border-color">
            <Link to="/expenses">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              loading={loading}
              className="min-w-[140px]"
            >
              Save Expense
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddExpense;
