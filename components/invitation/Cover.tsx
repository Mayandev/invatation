"use client";

import type { CSSProperties } from "react";
import { Icon } from "@/components/shared/Icon";
import { wedding } from "@/lib/wedding";

const openingSubtitles = [
  "编剧：邹明远  孙佳玮",
  "导演：邹明远  孙佳玮",
  "制作人：邹明远",
  "照片供应商：海马体",
  "BMG：Young And Beautiful",
  "特别顾问：Abby",
  "",
  "嗨～",
  "这是一封新郎和新娘精心制作的婚礼请柬",
  "每一个按钮都设置了我们的小惊喜哦",
  "结尾更有超级彩蛋等着您的发现，嘿嘿",
  "",
  "诚邀您来参加我们的婚礼",
  "见证和分享我们的喜悦",
  "我们的故事将以此为时间节点",
  "开启更加美好而努力的篇章",
  "",
  "祝，天天开心",
];

interface CoverProps {
  isOpening: boolean;
  isHidden: boolean;
  isMusicPlaying: boolean;
  hasMusicStarted: boolean;
  musicCurrentTime: number;
  musicDuration: number;
  onToggleMusic: () => void;
  onSeekMusic: (time: number) => void;
  onOpen: () => void;
}

export function Cover({
  isOpening,
  isHidden,
  isMusicPlaying,
  hasMusicStarted,
  musicCurrentTime,
  musicDuration,
  onToggleMusic,
  onSeekMusic,
  onOpen,
}: CoverProps) {
  const playbackLabel = isMusicPlaying
    ? "NOW PLAYING"
    : hasMusicStarted
      ? "PAUSED"
      : "READY TO PLAY";
  const coupleCaption = `新郎：${wedding.groom} · 新娘：${wedding.bride}`;
  const musicProgress = musicDuration > 0 ? Math.min((musicCurrentTime / musicDuration) * 100, 100) : 0;
  const fiftySecondPosition = musicDuration >= 50 ? (50 / musicDuration) * 100 : null;

  return (
    <section
      className={`cover${isOpening ? " is-opening" : ""}${isMusicPlaying ? " is-music-playing" : ""}`}
      id="cover"
      aria-label="请柬封面"
      hidden={isHidden}
    >
      <div className="cover__leaf">
        <div className="cover__ambient-bg" aria-hidden="true" />
        <header className="cover__masthead">
          <span>PRIVATE RECORD</span>
          <span>WEDDING EDITION</span>
        </header>
        <div className="cover__record-scene" aria-hidden="true">
          <div className="cover__vinyl">
            <div className="cover__vinyl-label" />
          </div>
          <div className="cover__sleeve">
            <div className="cover__sleeve-photo" />
            <span className="cover__edition">
              LIMITED
              <br />
              EDITION
            </span>
          </div>
          <div className="cover__tonearm" />
        </div>
        <div className="cover__headline">
          <p>
            <span aria-hidden="true" /> {playbackLabel}
          </p>
          <h1>We Got Married</h1>
          <div className="cover__marquee" aria-label={coupleCaption}>
            <div className="cover__marquee-track" aria-hidden="true">
              <span>{coupleCaption}</span>
            </div>
          </div>
          <div
            className="cover__subtitle-reel"
            aria-label={openingSubtitles.join("。")}
          >
            <div className="cover__subtitle-track" aria-hidden="true">
              {[...openingSubtitles].map(
                (subtitle, index) => (
                  <p key={`${subtitle}-${index}`}>{subtitle}</p>
                ),
              )}
            </div>
          </div>
        </div>
        <div className="cover__bottom">
          <div className="cover__progress">
            <input
              type="range"
              min="0"
              max={musicDuration || 0}
              step="0.1"
              value={Math.min(musicCurrentTime, musicDuration || 0)}
              aria-label="拖动调整音乐播放进度"
              disabled={!musicDuration}
              onChange={(event) => onSeekMusic(Number(event.target.value))}
              style={{
                "--music-progress": `${musicProgress}%`,
              } as CSSProperties}
            />
            {fiftySecondPosition !== null && (
              <button
                className="cover__progress-marker"
                style={{ left: `${fiftySecondPosition}%` }}
                type="button"
                aria-label="跳转至音乐 50 秒处"
                onClick={() => onSeekMusic(50)}
              />
            )}
          </div>
          <div className="cover__meta">
            <span>2024.01.18</span>
            {fiftySecondPosition !== null && (
              <span
                className="cover__meta-marker"
                style={{ left: `${fiftySecondPosition}%` }}
              >
                2026.10.6
              </span>
            )}
            <span>Forever</span>
          </div>
          <div className="cover__actions">
            <button
              className={`cover__play${isMusicPlaying ? " is-playing" : ""}`}
              type="button"
              aria-label={isMusicPlaying ? "暂停音乐" : "播放音乐"}
              aria-pressed={isMusicPlaying}
              onClick={onToggleMusic}
            >
              <Icon name={isMusicPlaying ? "pause" : "play"} />
            </button>
            <button
              className={`cover__enter${hasMusicStarted ? " is-ready" : ""}`}
              id="openInvitation"
              type="button"
              disabled={!hasMusicStarted}
              onClick={onOpen}
            >
              {!hasMusicStarted && (
                <Icon className="cover__music-cue" name="arrow-left" />
              )}
              <span>
                {hasMusicStarted ? "由此进入请柬" : "先整点 BGM 吧"}
              </span>
              {hasMusicStarted && <Icon name="arrow-up-right" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
