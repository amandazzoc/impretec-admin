import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DraftOrderItem } from '../types/order.type';
import { calculateItemSubtotal, calculateTotalPrice, formatCurrency } from './order.helpers';

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const buildItemsHtml = (items: DraftOrderItem[]): string => {
  return items
    .map((item) => {
      const subtotal = formatCurrency(calculateItemSubtotal(item));
      const obsHtml = item.observations
        ? `<p class="item-obs">${escapeHtml(item.observations)}</p>`
        : '';

      return `
        <div class="item-row">
          <div class="item-main">
            <p class="item-desc">${escapeHtml(item.description)}</p>
            ${obsHtml}
          </div>
          <span class="item-qty">${item.quantity}x &middot; ${formatCurrency(item.price)}</span>
          <span class="item-subtotal">${subtotal}</span>
        </div>`;
    })
    .join('');
};

const buildDocumentHtml = (
  clientName: string,
  deadline: string,
  items: DraftOrderItem[],
): string => {
  const deadlineFormatted = deadline
    ? new Date(deadline).toLocaleDateString('pt-BR')
    : 'Não definido';

  const issuedAt = new Date().toLocaleDateString('pt-BR');
  const total = formatCurrency(calculateTotalPrice(items));
  const itemsHtml = buildItemsHtml(items);
  const safeClientName = escapeHtml(clientName || 'Não informado');

  return `
    <div class="doc">
      <div class="doc-accent-bar"></div>
      <div class="doc-inner">

        <div class="doc-header">
          <span class="brand-name">Resumo do pedido</span>
          <div class="doc-meta">
            <p class="doc-eyebrow">Emitido em</p>
            <p class="doc-number">${issuedAt}</p>
          </div>
        </div>

        <h1 class="doc-title">${safeClientName}</h1>

        <div class="info-row">
          <div class="info-block">
            <p class="info-label">Prazo de entrega</p>
            <p class="info-value">${deadlineFormatted}</p>
          </div>
          <div class="info-block">
            <p class="info-label">Quantidade de itens</p>
            <p class="info-value">${items.length}</p>
          </div>
        </div>

        <p class="section-label">Itens do pedido</p>

        <div class="items">
          ${itemsHtml}
        </div>

        <div class="total-row">
          <span class="total-label">Total do pedido</span>
          <span class="total-value">${total}</span>
        </div>

        <div class="doc-footer">
          <p class="footer-note">Documento gerado automaticamente.</p>
        </div>

      </div>
    </div>
  `;
};

const DOCUMENT_STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .doc {
    width: 600px;
    background: #ffffff;
    font-family: 'Helvetica', 'Arial', sans-serif;
    color: #14171a;
  }
  .doc-accent-bar {
    height: 8px;
    width: 100%;
    background: linear-gradient(90deg, #1a9e5c 0%, #2ee884 100%);
  }
  .doc-inner {
    padding: 40px 44px 32px;
  }
  .doc-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
  }
  .brand-name {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    color: #14171a;
  }
  .doc-meta {
    text-align: right;
  }
  .doc-eyebrow {
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #1a9e5c;
    margin-bottom: 4px;
  }
  .doc-number {
    font-size: 12px;
    font-weight: 500;
    color: #8a9099;
  }
  .doc-title {
    font-size: 30px;
    font-weight: 700;
    letter-spacing: -0.5px;
    margin-bottom: 28px;
    line-height: 1.2;
  }
  .info-row {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;
  }
  .info-block {
    flex: 1;
    background: #f7f8f7;
    border: 1px solid #e8eae8;
    border-radius: 10px;
    padding: 16px;
  }
  .info-label {
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: #8a9099;
    margin-bottom: 7px;
  }
  .info-value {
    font-size: 16px;
    font-weight: 700;
    color: #14171a;
  }
  .section-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #14171a;
    margin-bottom: 14px;
  }
  .items {
    border: 1px solid #e8eae8;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 28px;
  }
  .item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 16px 18px;
    background: #ffffff;
    border-bottom: 1px solid #f0f1f0;
  }
  .item-row:last-child {
    border-bottom: none;
  }
  .item-main {
    flex: 1;
    min-width: 0;
  }
  .item-desc {
    font-size: 14px;
    font-weight: 700;
    color: #14171a;
    margin-bottom: 3px;
  }
  .item-obs {
    font-size: 11.5px;
    color: #8a9099;
  }
  .item-qty {
    font-size: 12px;
    color: #8a9099;
    font-weight: 500;
    white-space: nowrap;
  }
  .item-subtotal {
    font-size: 14px;
    font-weight: 700;
    color: #14171a;
    white-space: nowrap;
    min-width: 84px;
    text-align: right;
  }
  .total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #14171a;
    border-radius: 10px;
    padding: 20px 22px;
    margin-bottom: 32px;
  }
  .total-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.7px;
    text-transform: uppercase;
    color: #a8afa8;
  }
  .total-value {
    font-size: 24px;
    font-weight: 700;
    color: #2ee884;
    letter-spacing: -0.3px;
  }
  .doc-footer {
    padding-top: 20px;
    border-top: 1px solid #ececec;
  }
  .footer-note {
    font-size: 11px;
    color: #8a9099;
  }
`;

const waitForNextFrame = (): Promise<void> =>
  new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

export const downloadOrderSummaryPdf = async (
  clientName: string,
  deadline: string,
  items: DraftOrderItem[],
): Promise<void> => {
  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.top = '0';
  wrapper.style.left = '0';
  wrapper.style.zIndex = '-1';
  wrapper.style.opacity = '0.01';
  wrapper.style.pointerEvents = 'none';

  const style = document.createElement('style');
  style.textContent = DOCUMENT_STYLES;

  const container = document.createElement('div');
  container.innerHTML = buildDocumentHtml(clientName, deadline, items);

  wrapper.appendChild(style);
  wrapper.appendChild(container);
  document.body.appendChild(wrapper);

  await waitForNextFrame();

  try {
    const docElement = container.querySelector('.doc') as HTMLElement;

    // html2canvas usa o motor real do browser pra tirar um "screenshot" pixel-perfect,
    // diferente do pdf.html() que faz seu próprio parsing limitado de CSS
    const canvas = await html2canvas(docElement, {
      scale: 2, // resolução maior para texto nítido
      backgroundColor: '#ffffff',
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      unit: 'pt',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    const fileName = `pedido-${(clientName || 'cliente').toLowerCase().replace(/\s+/g, '-')}.pdf`;
    pdf.save(fileName);
  } finally {
    document.body.removeChild(wrapper);
  }
};
