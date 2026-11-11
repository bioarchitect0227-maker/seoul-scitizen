import React, { useState } from 'react';
import { Instructor, AiMatchResult } from '../types';
import { SEOUL_DISTRICTS } from '../data/instructors';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  UserCheck, 
  ArrowRight, 
  CheckCircle2, 
  Target, 
  Lightbulb, 
  Layers, 
  CalendarCheck,
  RefreshCw
} from 'lucide-react';

interface AiMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructors: Instructor[];
  onApplyWithMatch: (instructorName: string, topic: string) => void;
}

export const AiMatchModal: React.FC<AiMatchModalProps> = ({
  isOpen,
  onClose,
  instructors,
  onApplyWithMatch
}) => {
  const [targetAudience, setTargetAudience] = useState('서울 종로구 무악동 경로당 어르신 15명');
  const [goalTopic, setGoalTopic] = useState('스마트폰 말로 쓰기, 병원 예약 및 AI 보이스피싱 예방');
  const [district, setDistrict] = useState('종로구 (혜화/평창/종로/삼청)');
  const [sessionCount, setSessionCount] = useState<number>(2);
  const [participantCount, setParticipantCount] = useState<number>(15);

  const [loading, setLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<AiMatchResult | null>(null);
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  if (!isOpen) return null;

  const handleRunMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/ai/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetAudience,
          goalTopic,
          district,
          sessionCount,
          participantCount
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setMatchResult(data.data);
        setIsAiGenerated(Boolean(data.isAiGenerated));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const presetExamples = [
    {
      label: '👵 어르신 스마트폰 안심 활용',
      target: '서울 종로구 무악동 경로당 어르신 20명',
      topic: '스마트폰 글씨 크게 보기, 말로 전화걸기, 보이스피싱 예방',
      district: '종로구 (혜화/평창/종로/삼청)',
      sessions: 2
    },
    {
      label: '💼 소상공인 챗GPT 마케팅',
      target: '광장시장 상인회 사장님 15명',
      topic: '가게 네이버 지도 등록, 영수증 리뷰 AI 답글, 메뉴판 홍보물 캔바 디자인',
      district: '중구 (명동/을지로/충무로/회현)',
      sessions: 2
    },
    {
      label: '💻 직장인 엑셀·보고서 AI 자동화',
      target: '마포구 공덕동 주민센터 직장인 야간반 25명',
      topic: 'ChatGPT 프롬프트로 보고서 초안 작성 및 엑셀 데이터 분석 단축',
      district: '마포구 (공덕/상암/홍대/합정)',
      sessions: 4
    },
    {
      label: '🎬 청년 유튜브 쇼츠 영상 제작',
      target: '서울청년센터 청년 예비 크리에이터 15명',
      topic: '스마트폰으로 10분 만에 AI 음성 자막 릴스 영상 제작',
      district: '서대문구 (신촌/연희/홍제/남가좌)',
      sessions: 2
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-blue-700 text-white p-6 sm:p-7 flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>서울형 AI 교육설계 에이전트 (AI Education for the better life)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              AI 맞춤 시민강사 & 커리큘럼 추천 도우미
            </h2>
            <p className="text-xs text-emerald-100">
              청중의 특성과 희망 목표를 알려주시면 가장 적합한 서울시민강사와 맞춤 계획서를 실시간으로 기획해 드립니다.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Quick preset selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              빠른 예시 질문 선택하기:
            </label>
            <div className="flex flex-wrap gap-2">
              {presetExamples.map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setTargetAudience(ex.target);
                    setGoalTopic(ex.topic);
                    setDistrict(ex.district);
                    setSessionCount(ex.sessions);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-transparent text-xs font-semibold text-slate-700 transition-all cursor-pointer"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleRunMatch} className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                1. 교육 대상 및 인원
              </label>
              <input
                type="text"
                required
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="예: 서울 종로구 경로당 어르신 15명, 마포구 초등학생 학부모 20명 등"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                2. 배우고 싶은 내용 또는 달성하고 싶은 목표
              </label>
              <textarea
                rows={2}
                required
                value={goalTopic}
                onChange={(e) => setGoalTopic(e.target.value)}
                placeholder="예: 스마트폰 말로 다루기, ChatGPT 보고서 작성, 캔바로 포스터 만들기, 보이스피싱 예방"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                3. 희망 지역 (서울 25개 자치구 관내)
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none bg-white font-medium"
              >
                {SEOUL_DISTRICTS.map((d, i) => (
                  <option key={i} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  희망 차시
                </label>
                <select
                  value={sessionCount}
                  onChange={(e) => setSessionCount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none bg-white font-medium"
                >
                  <option value={1}>1회 (원데이)</option>
                  <option value={2}>2회 (기초+실습)</option>
                  <option value={4}>4회 (심화)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  수강 인원
                </label>
                <input
                  type="number"
                  min={5}
                  value={participantCount}
                  onChange={(e) => setParticipantCount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none bg-white font-medium"
                />
              </div>
            </div>

            <div className="sm:col-span-2 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>서울시민강사 데이터 및 AI 커리큘럼 분석 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>AI 맞춤 강사 & 커리큘럼 분석 시작</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Result view */}
          {matchResult && (
            <div className="space-y-6 pt-2 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h3 className="text-base font-bold text-slate-900">
                    서울시민을 위한 맞춤형 추천 기획서
                  </h3>
                  {isAiGenerated && (
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold">
                      Gemini 3.8 Flash 실시간 생성
                    </span>
                  )}
                </div>
              </div>

              {/* Recommended Instructor card */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <UserCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-xs text-emerald-800 font-bold uppercase tracking-wider">
                      추천 공인 시민강사
                    </div>
                    <div className="text-lg font-black text-slate-900">
                      {matchResult.recommendedInstructor.name}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium">
                      {matchResult.recommendedInstructor.title}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-emerald-950 bg-white/80 p-3 rounded-xl border border-emerald-100 leading-relaxed max-w-sm">
                  <strong>추천 사유:</strong> {matchResult.recommendedInstructor.matchReason}
                </div>
              </div>

              {/* Course Title and Overview */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                  <Target className="w-4 h-4" />
                  <span>맞춤형 교육 과정명</span>
                </div>
                <h4 className="text-lg font-extrabold text-slate-900">
                  {matchResult.courseTitle}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {matchResult.courseOverview}
                </p>

                {/* Learning Objectives */}
                <div className="pt-2">
                  <div className="text-xs font-bold text-slate-500 mb-1.5">핵심 학습 목표:</div>
                  <div className="space-y-1">
                    {matchResult.learningObjectives.map((obj, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Syllabus */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>차시별 세부 커리큘럼 계획</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {matchResult.syllabus.map((syl) => (
                    <div
                      key={syl.session}
                      className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 hover:border-emerald-300 transition-colors shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {syl.session}회차
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          도구: {syl.tools}
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-slate-900">{syl.title}</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">{syl.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prep tips */}
              {matchResult.preparationTips && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>교육 진행 팁:</strong> {matchResult.preparationTips}
                  </div>
                </div>
              )}

              {/* Apply with this match action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    onApplyWithMatch(
                      matchResult.recommendedInstructor.name,
                      matchResult.courseTitle
                    );
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>이 추천 강사 & 주제로 무료 출강 신청하기 →</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
