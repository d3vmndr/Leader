import React, { useEffect, useState } from 'react';
              ) : (
                <>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-slate-900">
                      {user.email || 'Anonymous User'}
                    </span>

                    <span className="text-[10px] text-slate-400 capitalize">
                      {role}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* MOBILE BUTTON */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 shadow-lg">
            <div className="px-4 py-6 space-y-2">
              {NAV_LINKS.map((link) => (
                <NavItem
                  key={link.id}
                  item={link}
                  isMobile
                />
              ))}

              {isAdmin && (
                <button
                  onClick={() => {
                    setActiveTab('admin');
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-medium w-full text-slate-600"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Panel
                </button>
              )}

              <div className="pt-6 mt-4 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full py-3 text-sm font-bold text-red-600 border border-red-100 rounded-xl hover:bg-red-50 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-12">