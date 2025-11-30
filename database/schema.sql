-- WhatsApp Dashboard Database Schema
-- PostgreSQL

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Webhook Events Table
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instance_name VARCHAR(100) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_instance_event (instance_name, event_type),
  INDEX idx_created_at (created_at DESC)
);

-- Message Statistics Table
CREATE TABLE IF NOT EXISTS message_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instance_name VARCHAR(100) NOT NULL,
  remote_jid VARCHAR(100) NOT NULL,
  message_id VARCHAR(255),
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('sent', 'received')),
  message_type VARCHAR(50) NOT NULL,
  status VARCHAR(20),
  has_media BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_instance_stats (instance_name, created_at DESC),
  INDEX idx_remote_jid (remote_jid, created_at DESC),
  INDEX idx_direction (direction, created_at DESC)
);

-- Contact Cache Table
CREATE TABLE IF NOT EXISTS contacts_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instance_name VARCHAR(100) NOT NULL,
  remote_jid VARCHAR(100) NOT NULL,
  push_name VARCHAR(255),
  profile_picture TEXT,
  is_group BOOLEAN DEFAULT FALSE,
  is_my_contact BOOLEAN DEFAULT FALSE,
  is_wa_contact BOOLEAN DEFAULT FALSE,
  labels JSONB,
  metadata JSONB,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(instance_name, remote_jid),
  INDEX idx_instance_contacts (instance_name, remote_jid)
);

-- Conversation Cache Table
CREATE TABLE IF NOT EXISTS conversations_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instance_name VARCHAR(100) NOT NULL,
  remote_jid VARCHAR(100) NOT NULL,
  last_message_id VARCHAR(255),
  last_message_text TEXT,
  last_message_timestamp TIMESTAMP,
  unread_count INTEGER DEFAULT 0,
  pinned BOOLEAN DEFAULT FALSE,
  archived BOOLEAN DEFAULT FALSE,
  muted BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(instance_name, remote_jid),
  INDEX idx_instance_conversations (instance_name, updated_at DESC)
);

-- Instance Configuration Table
CREATE TABLE IF NOT EXISTS instance_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instance_name VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(20),
  number VARCHAR(50),
  profile_name VARCHAR(255),
  profile_picture TEXT,
  webhook_config JSONB,
  settings JSONB,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Message Queue Table
CREATE TABLE IF NOT EXISTS message_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instance_name VARCHAR(100) NOT NULL,
  recipient VARCHAR(100) NOT NULL,
  message_type VARCHAR(50) NOT NULL,
  payload JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed')),
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  scheduled_at TIMESTAMP,
  processed_at TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_queue_status (status, scheduled_at),
  INDEX idx_instance_queue (instance_name, status)
);

-- Analytics Summary Table (for faster dashboard queries)
CREATE TABLE IF NOT EXISTS analytics_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instance_name VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  hour INTEGER,
  messages_sent INTEGER DEFAULT 0,
  messages_received INTEGER DEFAULT 0,
  messages_failed INTEGER DEFAULT 0,
  active_conversations INTEGER DEFAULT 0,
  new_contacts INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(instance_name, date, hour),
  INDEX idx_analytics_date (instance_name, date DESC)
);

-- Labels/Tags Table
CREATE TABLE IF NOT EXISTS contact_labels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instance_name VARCHAR(100) NOT NULL,
  remote_jid VARCHAR(100) NOT NULL,
  label VARCHAR(100) NOT NULL,
  color VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_labels (instance_name, remote_jid),
  UNIQUE(instance_name, remote_jid, label)
);

-- Quick Replies/Templates Table
CREATE TABLE IF NOT EXISTS quick_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instance_name VARCHAR(100) NOT NULL,
  shortcut VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  media_url TEXT,
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(instance_name, shortcut),
  INDEX idx_instance_shortcuts (instance_name, shortcut)
);

-- Auto Reply Rules Table
CREATE TABLE IF NOT EXISTS auto_reply_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instance_name VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  trigger_type VARCHAR(50) NOT NULL CHECK (trigger_type IN ('keyword', 'regex', 'all', 'group_only', 'private_only')),
  trigger_value TEXT,
  reply_message TEXT NOT NULL,
  reply_media_url TEXT,
  delay_seconds INTEGER DEFAULT 0,
  priority INTEGER DEFAULT 0,
  conditions JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_instance_rules (instance_name, enabled, priority)
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_contacts_cache_updated_at BEFORE UPDATE ON contacts_cache FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_cache_updated_at BEFORE UPDATE ON conversations_cache FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_instance_config_updated_at BEFORE UPDATE ON instance_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_analytics_summary_updated_at BEFORE UPDATE ON analytics_summary FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quick_replies_updated_at BEFORE UPDATE ON quick_replies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_auto_reply_rules_updated_at BEFORE UPDATE ON auto_reply_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create views for common queries
CREATE OR REPLACE VIEW v_dashboard_stats AS
SELECT
  instance_name,
  date,
  SUM(messages_sent) as total_sent,
  SUM(messages_received) as total_received,
  SUM(messages_failed) as total_failed,
  AVG(active_conversations) as avg_conversations
FROM analytics_summary
GROUP BY instance_name, date
ORDER BY date DESC;

CREATE OR REPLACE VIEW v_top_contacts AS
SELECT
  ms.instance_name,
  ms.remote_jid,
  cc.push_name,
  COUNT(*) as message_count,
  MAX(ms.created_at) as last_message_at
FROM message_stats ms
LEFT JOIN contacts_cache cc ON ms.instance_name = cc.instance_name AND ms.remote_jid = cc.remote_jid
WHERE ms.created_at >= NOW() - INTERVAL '30 days'
GROUP BY ms.instance_name, ms.remote_jid, cc.push_name
ORDER BY message_count DESC;
