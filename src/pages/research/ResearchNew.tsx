import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResearchStore } from '@/stores/useResearchStore';
import { RESEARCH_QUESTION_TYPES } from '@/lib/tax/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, FileText } from 'lucide-react';

export default function ResearchNew() {
  const navigate = useNavigate();
  const addMemo = useResearchStore(s => s.addMemo);
  const [form, setForm] = useState({
    questionSummary: '',
    questionDetail: '',
    questionType: 'DEDUCTIBILITY' as keyof typeof RESEARCH_QUESTION_TYPES,
    applicableTaxYear: 2024,
    preparedBy: 'Jennifer Walsh',
  });

  const handleSave = () => {
    if (!form.questionSummary) return;
    const id = addMemo({
      ...form,
      status: 'DRAFT',
      primaryIRCSections: [],
      relatedRegulations: [],
      revenueRulings: [],
      plrs: [],
      courtCases: [],
      conclusion: '',
      confidenceLevel: 'LOW',
      riskLevel: 'MODERATE',
      memoContent: '# Draft Research Memo\n\n**Question:** ' + form.questionDetail + '\n\n*(Run Tax Research Agent to generate full memo)*',
      tags: [],
    });
    navigate(`/research/${id}`);
  };

  return (
    <div className="max-w-[900px] mx-auto space-y-5">
      <Button variant="ghost" size="sm" className="text-xs text-tm-text-secondary px-0" onClick={() => navigate('/research')}>
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Library
      </Button>
      <div className="flex items-center gap-3">
        <Search className="w-6 h-6 text-tm-brand" />
        <h1 className="text-2xl font-semibold text-tm-text-primary">New Research Question</h1>
      </div>

      <Card className="bg-tm-bg-card border-tm-border">
        <CardContent className="p-5 space-y-4">
          <div>
            <Label className="form-label">Question Summary *</Label>
            <Input value={form.questionSummary} onChange={e => setForm({ ...form, questionSummary: e.target.value })} className="input-tax" placeholder="e.g., Deductibility of home office expenses under §280A" />
          </div>
          <div>
            <Label className="form-label">Detailed Question</Label>
            <textarea value={form.questionDetail} onChange={e => setForm({ ...form, questionDetail: e.target.value })} className="input-tax w-full min-h-[100px] resize-y" placeholder="Full description of the tax question, including relevant facts..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="form-label">Question Type</Label>
              <Select value={form.questionType} onValueChange={v => setForm({ ...form, questionType: v as keyof typeof RESEARCH_QUESTION_TYPES })}>
                <SelectTrigger className="input-tax"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-tm-bg-elevated border-tm-border">
                  {Object.entries(RESEARCH_QUESTION_TYPES).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="form-label">Tax Year</Label>
              <Input type="number" value={form.applicableTaxYear} onChange={e => setForm({ ...form, applicableTaxYear: Number(e.target.value) })} className="input-tax font-data" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" className="border-tm-border bg-tm-bg-elevated" onClick={() => navigate('/research')}>Cancel</Button>
            <Button className="bg-tm-brand hover:bg-tm-brand-mid gap-1.5" onClick={handleSave} disabled={!form.questionSummary}>
              <FileText className="w-4 h-4" /> Save & Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
