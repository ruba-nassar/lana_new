import { useState, forwardRef } from "react";
import HTMLFlipBook from "react-pageflip";

const COVER_W = 320;
const COVER_H = 450;

const PassportPage = forwardRef<
  HTMLDivElement,
  { children?: React.ReactNode }
>(({ children }, ref) => (
  <div ref={ref} className="pp-page">
    {children}
  </div>
));
PassportPage.displayName = "PassportPage";

function PageContent({
  pageNum,
  onClose,
}: {
  pageNum: number;
  onClose?: () => void;
}) {
  return (
    <div className="pp-page-inner">
      <div className="pp-page-header">
        <span className="pp-page-num">{pageNum}</span>
        <div className="pp-cross-small">✝</div>
      </div>

      <div className="pp-field">
        <label className="pp-label">اسم التحدي</label>
        <div className="pp-underline-input" />
      </div>

      <div className="pp-row">
        <div className="pp-field pp-field-half">
          <label className="pp-label">الجولة ١</label>
          <div className="pp-underline-input" />
        </div>
        <div className="pp-field pp-field-half">
          <label className="pp-label">الجولة ٢</label>
          <div className="pp-underline-input" />
        </div>
      </div>

      <div className="pp-field pp-field-grow">
        <label className="pp-label">تأمل</label>
        <textarea className="pp-textarea" placeholder="اكتب هنا…" />
      </div>

      <div className="pp-field pp-field-grow">
        <label className="pp-label">اقتلاع</label>
        <textarea className="pp-textarea" placeholder="اكتب هنا…" />
      </div>

      {onClose && (
        <div className="pp-close-row">
          <button onClick={onClose} className="pp-close-btn">
            إغلاق الجواز
          </button>
        </div>
      )}
    </div>
  );
}

export default function Passport() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="pp-section">
      <h2 className="pp-section-title">📖 جواز العبور</h2>

      <div className="pp-center">
        {!isOpen ? (
          <div
            className="pp-cover"
            style={{ width: COVER_W, height: COVER_H }}
          >
            <div className="pp-cover-frame" />
            <div className="pp-cover-body">
              <p className="pp-cover-sub">مملكة الله</p>
              <div className="pp-cover-cross">✝</div>
              <h2 className="pp-cover-title">جواز العبور</h2>
              <p className="pp-cover-sub">الدخول إلى جبل صهيون</p>
              <button
                className="pp-open-btn"
                onClick={() => setIsOpen(true)}
              >
                افتح الجواز
              </button>
            </div>
          </div>
        ) : (
          <div className="pp-book-wrapper">
            <HTMLFlipBook
              width={COVER_W}
              height={COVER_H}
              size="fixed"
              minWidth={COVER_W}
              maxWidth={COVER_W}
              minHeight={COVER_H}
              maxHeight={COVER_H}
              maxShadowOpacity={0.4}
              showCover={false}
              mobileScrollSupport={true}
              className="pp-flipbook"
              style={{}}
              startPage={0}
              drawShadow={true}
              flippingTime={650}
              usePortrait={true}
              startZIndex={0}
              autoSize={false}
              clickEventForward={true}
              useMouseEvents={true}
              swipeDistance={30}
              showPageCorners={true}
              disableFlipByClick={false}
            >
              <PassportPage>
                <PageContent pageNum={1} />
              </PassportPage>

              <PassportPage>
                <PageContent pageNum={2} />
              </PassportPage>

              <PassportPage>
                <PageContent pageNum={3} />
              </PassportPage>

              <PassportPage>
                <PageContent pageNum={4} onClose={() => setIsOpen(false)} />
              </PassportPage>
            </HTMLFlipBook>

            <p className="pp-flip-hint">← اسحب الصفحة للتقليب →</p>
          </div>
        )}
      </div>
    </section>
  );
}
