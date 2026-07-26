import { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import TabBar from '../components/TabBar'
import Input from '../components/Input'
import TextArea from '../components/TextArea'
import RadioGroup from '../components/RadioGroup'
import PhotoUpload from '../components/PhotoUpload'
import Button from '../components/Button'
import Card from '../components/Card'
import StatusTag from '../components/StatusTag'
import {
  getOwnerId,
  setOwnerId,
  getOwnerById,
  createOwner,
  updateOwner,
  getVisitorsByOwner,
  updateVisitorStatus,
  generateId,
  copyToClipboard,
  formatTime,
  resetOwnerData,
  regenerateLinkId,
} from '../lib/utils'

const tabs = [
  { key: 'edit', label: '资料编辑' },
  { key: 'visitors', label: '访客管理' },
]

const genderOptions = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
  { value: 'other', label: '其他' },
]

export default function OwnerPage() {
  const [activeTab, setActiveTab] = useState('edit')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [owner, setOwner] = useState(null)

  const [nickname, setNickname] = useState('')
  const [gender, setGender] = useState('')
  const [wechat, setWechat] = useState('')
  const [bio, setBio] = useState('')
  const [expectation, setExpectation] = useState('')
  const [photos, setPhotos] = useState([])
  const [linkStatus, setLinkStatus] = useState('active')
  const [linkId, setLinkId] = useState('')

  const [visitors, setVisitors] = useState([])
  const [visitorsLoading, setVisitorsLoading] = useState(false)

  useEffect(() => {
    loadOwnerData()
  }, [])

  useEffect(() => {
    if (activeTab === 'visitors' && owner?.id) {
      loadVisitors()
    }
  }, [activeTab, owner?.id])

  const loadOwnerData = async () => {
    const savedOwnerId = getOwnerId()
    if (savedOwnerId) {
      const data = await getOwnerById(savedOwnerId)
      if (data) {
        setOwner(data)
        fillFormData(data)
      } else {
        initNewOwner()
      }
    } else {
      initNewOwner()
    }
    setLoading(false)
  }

  const initNewOwner = () => {
    const newLinkId = generateId().slice(0, 8)
    setLinkId(newLinkId)
  }

  const fillFormData = (data) => {
    setNickname(data.nickname || '')
    setGender(data.gender || '')
    setWechat(data.wechat || '')
    setBio(data.bio || '')
    setExpectation(data.expectation || '')
    setPhotos(data.photos || [])
    setLinkStatus(data.link_status || 'active')
    setLinkId(data.link_id || '')
  }

  const validateForm = () => {
    if (!nickname.trim()) {
      alert('请输入昵称')
      return false
    }
    if (!gender) {
      alert('请选择性别')
      return false
    }
    if (!wechat.trim()) {
      alert('请输入微信号')
      return false
    }
    return true
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setSaving(true)
    try {
      const ownerData = {
        nickname: nickname.trim(),
        gender,
        wechat: wechat.trim(),
        bio: bio.trim(),
        expectation: expectation.trim(),
        photos,
        link_id: linkId,
        link_status: linkStatus,
      }

      let result
      if (owner?.id) {
        result = await updateOwner(owner.id, ownerData)
      } else {
        result = await createOwner(ownerData)
        if (result) {
          setOwnerId(result.id)
          setOwner(result)
        }
      }

      if (result) {
        alert('保存成功！')
        setOwner(result)
      } else {
        alert('保存失败，请重试')
      }
    } catch (err) {
      console.error('Save error:', err)
      alert('保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  const handleCopyLink = async () => {
    if (!linkId) return
    const link = `${window.location.origin}${window.location.pathname}#/u/${linkId}`
    const success = await copyToClipboard(link)
    if (success) {
      alert('链接已复制到剪贴板')
    }
  }

  const handleCloseLink = async () => {
    if (!window.confirm('确认关闭后任何人无法访问该链接，访客记录保留。确定要关闭吗？')) return

    setSaving(true)
    try {
      const result = await updateOwner(owner.id, { link_status: 'closed' })
      if (result) {
        setLinkStatus('closed')
        setOwner(result)
        alert('链接已关闭')
      }
    } catch (err) {
      console.error('Close link error:', err)
      alert('操作失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  const handleOpenLink = async () => {
    if (!window.confirm('确定要重新开启分享链接吗？')) return

    setSaving(true)
    try {
      const result = await updateOwner(owner.id, { link_status: 'active' })
      if (result) {
        setLinkStatus('active')
        setOwner(result)
        alert('链接已重新开启')
      }
    } catch (err) {
      console.error('Open link error:', err)
      alert('操作失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  const handleRegenerateLink = async () => {
    if (!window.confirm('生成新链接后，旧链接将立即失效，访客记录保留。确定要生成新链接吗？')) return

    setSaving(true)
    try {
      const result = await regenerateLinkId(owner.id)
      if (result) {
        setLinkId(result.newLinkId)
        setLinkStatus('active')
        setOwner(result)
        alert('新链接已生成')
      }
    } catch (err) {
      console.error('Regenerate link error:', err)
      alert('操作失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  const handleResetData = async () => {
    if (!window.confirm('确定要清空所有资料吗？访客记录会保留，清空后可以重新填写。确定要继续吗？')) return

    setSaving(true)
    try {
      const result = await resetOwnerData(owner.id)
      if (result) {
        fillFormData(result)
        setOwner(result)
        alert('资料已清空，请重新填写')
      }
    } catch (err) {
      console.error('Reset data error:', err)
      alert('操作失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  const loadVisitors = async () => {
    if (!owner?.id) return
    setVisitorsLoading(true)
    const data = await getVisitorsByOwner(owner.id)
    setVisitors(data)
    setVisitorsLoading(false)
  }

  const handleApprove = async (visitorId) => {
    if (!window.confirm('确定同意解锁该访客的查看权限吗？')) return
    const result = await updateVisitorStatus(visitorId, 'approved')
    if (result) {
      setVisitors(visitors.map((v) => (v.id === visitorId ? result : v)))
    }
  }

  const handleRevoke = async (visitorId) => {
    if (!window.confirm('确定撤销该访客的查看权限吗？')) return
    const result = await updateVisitorStatus(visitorId, 'revoked')
    if (result) {
      setVisitors(visitors.map((v) => (v.id === visitorId ? result : v)))
    }
  }

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <p className="text-text-muted">加载中...</p>
      </div>
    )
  }

  return (
    <div className="page-container min-h-screen bg-white pb-safe">
      <NavBar title="主人后台" />

      <div className="p-5">
        <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === 'edit' && (
        <div className="px-5 pb-8">
          {linkId && (
            <Card className="mb-5 p-4 bg-primary-50 border-0">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${linkStatus === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`text-sm font-medium ${linkStatus === 'active' ? 'text-green-600' : 'text-red-500'}`}>
                  {linkStatus === 'active' ? '链接正常启用中' : '链接已关闭'}
                </span>
              </div>
              {linkStatus === 'active' ? (
                <>
                  <div className="bg-white rounded-full px-4 py-3 text-xs text-text-muted font-mono mb-3 break-all">
                    {`${window.location.origin}${window.location.pathname}#/u/${linkId}`}
                  </div>
                  <Button block onClick={handleCopyLink}>
                    📋 一键复制链接
                  </Button>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button variant="secondary" block onClick={handleCloseLink} disabled={saving}>
                      关闭链接
                    </Button>
                    <Button variant="outline" block onClick={handleRegenerateLink} disabled={saving}>
                      生成新链接
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-text-muted mb-3">当前链接已失效</p>
                  <Button variant="primary" block onClick={handleOpenLink} disabled={saving}>
                    重新开启链接
                  </Button>
                  <Button variant="outline" block onClick={handleRegenerateLink} disabled={saving} className="mt-2">
                    生成新链接
                  </Button>
                </>
              )}
            </Card>
          )}

          <Input
            label="昵称"
            required
            placeholder="请输入你的昵称"
            value={nickname}
            onChange={setNickname}
          />

          <RadioGroup
            label="性别"
            required
            options={genderOptions}
            value={gender}
            onChange={setGender}
          />

          <Input
            label="微信号"
            required
            placeholder="请输入微信号"
            value={wechat}
            onChange={setWechat}
          />

          <TextArea
            label="自我介绍"
            placeholder="简单介绍一下自己吧"
            value={bio}
            onChange={setBio}
            rows={3}
          />

          <TextArea
            label="交友期许"
            placeholder="你期待什么样的朋友？"
            value={expectation}
            onChange={setExpectation}
            rows={3}
          />

          <div className="mb-5">
            <label className="block mb-2 text-text">
              个人照片（最多3张）
            </label>
            <PhotoUpload
              photos={photos}
              onChange={setPhotos}
              maxPhotos={3}
              ownerId={owner?.id || linkId}
            />
          </div>

          <Button block onClick={handleSave} disabled={saving}>
            {saving ? '保存中...' : '保 存 资 料'}
          </Button>
          {owner?.id && (
            <Button variant="danger" block onClick={handleResetData} disabled={saving} className="mt-3">
              清空资料
            </Button>
          )}
        </div>
      )}

      {activeTab === 'visitors' && (
        <div className="px-5 pb-8">
          <p className="text-sm text-text-muted mb-4">
            共 <span className="text-primary-500 font-semibold">{visitors.length}</span> 位访客提交信息
          </p>

          {visitorsLoading ? (
            <p className="text-center text-text-muted py-12">加载中...</p>
          ) : visitors.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4 opacity-30">📭</div>
              <p className="text-text-muted">暂无访客提交信息</p>
            </div>
          ) : (
            <div className="space-y-3">
              {visitors.map((visitor) => (
                <Card key={visitor.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-base">{visitor.nickname}</div>
                      <div className="text-xs text-text-muted mt-0.5">
                        {visitor.gender === 'male' ? '男' : visitor.gender === 'female' ? '女' : '其他'} · {formatTime(visitor.created_at)}
                      </div>
                    </div>
                    <StatusTag status={visitor.status} />
                  </div>
                  <p className="text-sm text-text-muted mb-4 leading-relaxed">
                    {visitor.bio}
                  </p>
                  <div className="text-xs text-text-muted mb-3">
                    微信号：<span className="text-text font-mono">{visitor.wechat}</span>
                  </div>
                  <div className="flex gap-2">
                    {(visitor.status === 'pending' || visitor.status === 'revoked') && (
                      <Button size="small" variant="primary" block onClick={() => handleApprove(visitor.id)}>
                        同意解锁
                      </Button>
                    )}
                    {visitor.status === 'approved' && (
                      <Button size="small" variant="danger" block onClick={() => handleRevoke(visitor.id)}>
                        撤销解锁
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
