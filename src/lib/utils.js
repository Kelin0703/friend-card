import { supabase } from './supabase'

export const generateId = () => {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export const getVisitorId = () => {
  let vid = localStorage.getItem('friend_card_visitor_id')
  if (!vid) {
    vid = generateId()
    localStorage.setItem('friend_card_visitor_id', vid)
  }
  return vid
}

export const getOwnerId = () => {
  return localStorage.getItem('friend_card_owner_id')
}

export const setOwnerId = (id) => {
  localStorage.setItem('friend_card_owner_id', id)
}

export const formatTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    return true
  }
}

export const getLinkByLinkId = async (linkId) => {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('link_id', linkId)
    .single()

  if (error) {
    console.error('Get link error:', error)
    return null
  }
  return data
}

export const getOwnerByLinkId = async (linkId) => {
  const link = await getLinkByLinkId(linkId)
  if (!link) return null

  const { data, error } = await supabase
    .from('owners')
    .select('*')
    .eq('id', link.owner_id)
    .single()

  if (error) {
    console.error('Get owner error:', error)
    return null
  }
  return { ...data, link_status: link.status }
}

export const getVisitorRecord = async (ownerId, visitorId) => {
  const { data, error } = await supabase
    .from('visitors')
    .select('*')
    .eq('owner_id', ownerId)
    .eq('visitor_id', visitorId)
    .maybeSingle()

  if (error) {
    console.error('Get visitor error:', error)
    return null
  }
  return data
}

export const checkWechatDuplicate = async (ownerId, wechat) => {
  const { data, error } = await supabase
    .from('visitors')
    .select('id')
    .eq('owner_id', ownerId)
    .eq('wechat', wechat)
    .maybeSingle()

  if (error) {
    console.error('Check wechat duplicate error:', error)
    return null
  }
  return data
}

export const submitVisitorInfo = async (visitorData) => {
  const { data, error } = await supabase
    .from('visitors')
    .insert(visitorData)
    .select()
    .single()

  if (error) {
    console.error('Submit visitor error:', error)
    return null
  }
  return data
}

export const updateVisitorInfo = async (ownerId, visitorId, visitorData) => {
  const { data, error } = await supabase
    .from('visitors')
    .update(visitorData)
    .eq('owner_id', ownerId)
    .eq('visitor_id', visitorId)
    .select()
    .single()

  if (error) {
    console.error('Update visitor info error:', error)
    return null
  }
  return data
}

export const createLink = async (ownerId) => {
  const linkId = generateId().slice(0, 8)
  const { data, error } = await supabase
    .from('links')
    .insert({
      owner_id: ownerId,
      link_id: linkId,
      status: 'active',
    })
    .select()
    .single()

  if (error) {
    console.error('Create link error:', error)
    return null
  }
  return data
}

export const createOwner = async (ownerData) => {
  const { data, error } = await supabase
    .from('owners')
    .insert(ownerData)
    .select()
    .single()

  if (error) {
    console.error('Create owner error:', error)
    return null
  }

  const link = await createLink(data.id)
  if (!link) {
    return data
  }

  return { ...data, link_id: link.link_id }
}

export const updateOwner = async (ownerId, ownerData) => {
  const { data, error } = await supabase
    .from('owners')
    .update(ownerData)
    .eq('id', ownerId)
    .select()
    .single()

  if (error) {
    console.error('Update owner error:', error)
    return null
  }
  return data
}

export const getOwnerById = async (ownerId) => {
  const { data, error } = await supabase
    .from('owners')
    .select('*')
    .eq('id', ownerId)
    .single()

  if (error) {
    console.error('Get owner error:', error)
    return null
  }
  return data
}

export const getVisitorsByOwner = async (ownerId) => {
  const { data, error } = await supabase
    .from('visitors')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Get visitors error:', error)
    return []
  }
  return data || []
}

export const updateVisitorStatus = async (visitorId, status) => {
  const { data, error } = await supabase
    .from('visitors')
    .update({ status })
    .eq('id', visitorId)
    .select()
    .single()

  if (error) {
    console.error('Update visitor status error:', error)
    return null
  }
  return data
}

export const resetOwnerData = async (ownerId) => {
  const { data, error } = await supabase
    .from('owners')
    .update({
      nickname: '',
      gender: '',
      wechat: '',
      bio: '',
      expectation: '',
      photos: [],
      updated_at: new Date().toISOString(),
    })
    .eq('id', ownerId)
    .select()
    .single()

  if (error) {
    console.error('Reset owner data error:', error)
    return null
  }
  return data
}

export const getLinksByOwner = async (ownerId) => {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Get links error:', error)
    return []
  }
  return data || []
}

export const updateLinkStatus = async (linkId, status) => {
  const { data, error } = await supabase
    .from('links')
    .update({ status })
    .eq('link_id', linkId)
    .select()
    .single()

  if (error) {
    console.error('Update link status error:', error)
    return null
  }
  return data
}

export const regenerateLinkId = async (ownerId) => {
  const link = await createLink(ownerId)
  return link
}
