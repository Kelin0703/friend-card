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
import ImagePreview from '../components/ImagePreview'
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
  getLinksByOwner,
  updateLinkStatus,
  createLink,
} from '../lib/utils'

const tabs = [
  { key: 'edit', label: '资料编辑' },
  { key: 'visitors', label: '访客管理' },
]

const genderOptions = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
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

  const [links, setLinks] = useState([])
  const [showHistoryLinks, setShowHistoryLinks] = useState(false)

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
        await loadLinks()
      } else {
        initNewOwner()
      }
    } else {
      initNewOwner()
    }
    setLoading(false)
  }

  const loadLinks = async () => {
    if (!owner?.id) return
    const data = await getLinksByOwner(owner.id)
    setLinks(data)
  }

  const initNewOwner = () => {
  }

  const fillFormData = (data) => {
    setNickname(data.nickname || '')
    setGender(data.gender || '')
    setWechat(data.wechat || '')
    setBio(data.bio || '')
    setExpectation(data.expectation || '')
    setPhotos(data.photos || [])
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
      }

      let result
      if (owner?.id) {
        result = await updateOwner(owner.id, ownerData)
      } else {
        result = await createOwner(ownerData)
        if (result) {
          setOwnerId(result.id)
          setOwner(result)
          await loadLinks()
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

  const handleCopyLink = async (linkId) => {
    if (!linkId) return
    const link = `${window.location.origin}${window.location.pathname}#/u/${linkId}`
    const success = await copyToClipboard(link)
    if (success) {
      alert('链接已复制到剪贴板')
    }
  }

  const handleToggleLink = async (linkId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'closed' : 'active'
    const action = newStatus === 'active' ? '开启' : '关闭'

    if (!window.confirm(`确定要${action}该链接吗？`)) return

    setSaving(true)
    try {
      const result = await updateLinkStatus(linkId, newStatus)
      if (result) {
        setLinks(links.map((l) => (l.link_id === linkId ? result : l)))
        alert(`链接已${action}`)
      }
    } catch (err) {
      console.error('Toggle link error:', err)
      alert('操作失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  const handleCreateNewLink = async () => {
    if (!window.confirm('生成新链接后，旧链接保持不变。确定要生成新链接吗？')) return

    setSaving(true)
    try {
      const result = await createLink(owner.id)
      if (result) {
        setLinks((prev) => [result, ...prev])
        alert('新链接已生成')
      }
    } catch (err) {
      console.error('Create link error:', err)
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

  const activeLinks = links.filter((l) => l.status === 'active')
  const closedLinks = links.filter((l) => l.status === 'closed')

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
          {owner?.id && (
            <Card className="mb-5 p-4 bg-primary-50 border-0">
              <div className="text-sm font-medium text-primary-700 mb-3">链接管理</div>

              {links.length === 0 && (
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">🔗</div>
                  <p className="text-xs text-text-muted mb-3">还没有分享链接</p>
                  <Button size="small" onClick={handleCreateNewLink} disabled={saving}>
                    生成分享链接
                  </Button>
                </div>
              )}

              {activeLinks.map((link) => (
                <div key={link.link_id} className="bg-white rounded-xl p-3 mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-green-600 font-medium">当前链接</span>
                  </div>
                  <div className="bg-surface-muted rounded-full px-4 py-2 text-xs text-text-muted font-mono mb-3 break-all">
                    {`${window.location.origin}${window.location.pathname}#/u/${link.link_id}`}
                  </div>
                  <div className="flex gap-2">
                    <Button size="small" block onClick={() => handleCopyLink(link.link_id)}>
                      复制
                    </Button>
                    <Button size="small" variant="secondary" block onClick={() => handleToggleLink(link.link_id, link.status)} disabled={saving}>
                      关闭
                    </Button>
                  </div>
                </div>
              ))}

              {closedLinks.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowHistoryLinks(!showHistoryLinks)}
                    className="flex items-center gap-1 text-xs text-text-muted mb-2"
                  >
                    <span>历史链接（{closedLinks.length}个）</span>
                    <span className={`transition-transform ${showHistoryLinks ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {showHistoryLinks && (
                    <div className="space-y-2">
                      {closedLinks.map((link) => (
                        <div key={link.link_id} className="bg-white rounded-xl p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="text-xs text-red-500 font-medium">已关闭</span>
                            <span className="text-xs text-text-light ml-auto">{formatTime(link.created_at)}</span>
                          </div>
                          <div className="bg-surface-muted rounded-full px-4 py-2 text-xs text-text-muted font-mono mb-3 break-all">
                            {`${window.location.origin}${window.location.pathname}#/u/${link.link_id}`}
                          </div>
                          <div className="flex gap-2">
                            <Button size="small" variant="outline" block onClick={() => handleCopyLink(link.link_id)}>
                              复制
                            </Button>
                            <Button size="small" block onClick={() => handleToggleLink(link.link_id, link.status)} disabled={saving}>
                              重新开启
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <Button variant="outline" block onClick={handleCreateNewLink} disabled={saving} className="mt-3">
                + 生成新链接
              </Button>
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
              ownerId={owner?.id || 'new'}
            />
          </div>

          <Button block onClick={handleSave} disabled={saving}>
            {saving ? '保存中...' : '保 存 资 料'}
          </Button>
          {owner?.id && (
            <Button variant="danger" block onClick={handleResetData} disabled={saving} className="mt-3">
              重置资料
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
                  <p className="text-sm text-text-muted mb-3 leading-relaxed">
                    {visitor.bio}
                  </p>
                  {visitor.expectation && (
                    <div className="mb-3">
                      <div className="text-xs text-text-muted mb-1">交友期许</div>
                      <p className="text-sm text-text-muted leading-relaxed">
                        {visitor.expectation}
                      </p>
                    </div>
                  )}
                  {visitor.photos && visitor.photos.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs text-text-muted mb-2">个人照片</div>
                      <div className="grid grid-cols-3 gap-2">
                        {visitor.photos.map((photo, index) => (
                          <div key={index} className="aspect-square rounded-lg overflow-hidden">
                            <ImagePreview
                              src={photo}
                              alt={`照片${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
